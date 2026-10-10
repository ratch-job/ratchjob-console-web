/** 默认：每分钟第 0 秒（6 段，对齐 Rust cron） */
export const DEFAULT_CRON = '0 * * * * *';

export const FIELD_DEFS = [
  { key: 'second', min: 0, max: 59 },
  { key: 'minute', min: 0, max: 59 },
  { key: 'hour', min: 0, max: 23 },
  { key: 'day', min: 1, max: 31 },
  { key: 'month', min: 1, max: 12 },
  { key: 'week', min: 0, max: 6 }
];

/**
 * @typedef {'every'|'range'|'step'|'list'} FieldMode
 * @typedef {{ mode: FieldMode, rangeStart: number, rangeEnd: number, stepStart: number, step: number, list: number[] }} FieldState
 */

/**
 * @param {number} min
 * @param {number} max
 * @returns {FieldState}
 */
export function createDefaultFieldState(min, max) {
  return {
    mode: 'every',
    rangeStart: min,
    rangeEnd: max,
    stepStart: min,
    step: 1,
    list: [min]
  };
}

/**
 * @param {string} segment
 * @param {number} min
 * @param {number} max
 * @returns {FieldState | null}
 */
export function parseField(segment, min, max) {
  if (!segment || typeof segment !== 'string') {
    return null;
  }
  const value = segment.trim();
  if (value === '*') {
    return createDefaultFieldState(min, max);
  }

  // a/b  或  */b
  const stepMatch = value.match(/^(\*|\d+)\/(\d+)$/);
  if (stepMatch) {
    const start = stepMatch[1] === '*' ? min : Number(stepMatch[1]);
    const step = Number(stepMatch[2]);
    if (!Number.isInteger(start) || !Number.isInteger(step)) {
      return null;
    }
    if (start < min || start > max || step < 1 || step > max - min + 1) {
      return null;
    }
    return {
      ...createDefaultFieldState(min, max),
      mode: 'step',
      stepStart: start,
      step
    };
  }

  // a-b
  const rangeMatch = value.match(/^(\d+)-(\d+)$/);
  if (rangeMatch) {
    const rangeStart = Number(rangeMatch[1]);
    const rangeEnd = Number(rangeMatch[2]);
    if (
      !Number.isInteger(rangeStart) ||
      !Number.isInteger(rangeEnd) ||
      rangeStart < min ||
      rangeEnd > max ||
      rangeStart > rangeEnd
    ) {
      return null;
    }
    return {
      ...createDefaultFieldState(min, max),
      mode: 'range',
      rangeStart,
      rangeEnd
    };
  }

  // a,b,c
  if (/^\d+(,\d+)*$/.test(value)) {
    const list = value.split(',').map((item) => Number(item));
    const unique = [...new Set(list)].sort((a, b) => a - b);
    if (
      unique.length === 0 ||
      unique.some((n) => !Number.isInteger(n) || n < min || n > max)
    ) {
      return null;
    }
    return {
      ...createDefaultFieldState(min, max),
      mode: 'list',
      list: unique
    };
  }

  // 单值视为指定
  if (/^\d+$/.test(value)) {
    const n = Number(value);
    if (!Number.isInteger(n) || n < min || n > max) {
      return null;
    }
    return {
      ...createDefaultFieldState(min, max),
      mode: 'list',
      list: [n]
    };
  }

  return null;
}

/**
 * @param {FieldState} state
 * @param {number} min
 * @param {number} max
 * @returns {string}
 */
export function buildField(state, min, max) {
  if (!state) {
    return '*';
  }
  switch (state.mode) {
    case 'every':
      return '*';
    case 'range': {
      const start = clamp(state.rangeStart, min, max);
      const end = clamp(state.rangeEnd, min, max);
      return start <= end ? `${start}-${end}` : `${end}-${start}`;
    }
    case 'step': {
      const start = clamp(state.stepStart, min, max);
      const step = Math.max(1, Number(state.step) || 1);
      return `${start}/${step}`;
    }
    case 'list': {
      const list = (state.list || [])
        .map((n) => Number(n))
        .filter((n) => Number.isInteger(n) && n >= min && n <= max);
      const unique = [...new Set(list)].sort((a, b) => a - b);
      return unique.length ? unique.join(',') : String(min);
    }
    default:
      return '*';
  }
}

/**
 * @param {string} expression
 * @returns {{ ok: true, fields: FieldState[] } | { ok: false, fields: FieldState[] }}
 */
export function parseCronExpression(expression) {
  const defaults = FIELD_DEFS.map((def) =>
    createDefaultFieldState(def.min, def.max)
  );
  if (!expression || typeof expression !== 'string') {
    return { ok: false, fields: defaults };
  }
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 6) {
    return { ok: false, fields: defaults };
  }
  const fields = [];
  for (let i = 0; i < FIELD_DEFS.length; i++) {
    const def = FIELD_DEFS[i];
    const parsed = parseField(parts[i], def.min, def.max);
    if (!parsed) {
      return { ok: false, fields: defaults };
    }
    fields.push(parsed);
  }
  return { ok: true, fields };
}

/**
 * @param {FieldState[]} fields
 * @returns {string}
 */
export function buildCronExpression(fields) {
  return FIELD_DEFS.map((def, index) =>
    buildField(fields[index], def.min, def.max)
  ).join(' ');
}

/**
 * 简单结构校验（不依赖 cron-parser）
 * @param {string} expression
 */
export function isSupportedSixFieldCron(expression) {
  return parseCronExpression(expression).ok;
}

function clamp(value, min, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) {
    return min;
  }
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

/**
 * @param {number} min
 * @param {number} max
 * @returns {number[]}
 */
export function rangeOptions(min, max) {
  const result = [];
  for (let i = min; i <= max; i++) {
    result.push(i);
  }
  return result;
}
