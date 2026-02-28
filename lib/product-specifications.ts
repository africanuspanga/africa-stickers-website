export interface ProductSpecificationItem {
  label: string
  value: string
  label_sw?: string
  value_sw?: string
}

interface NormalizeProductSpecificationsOptions {
  includeLegacyFlatObject?: boolean
}

const RESERVED_SPEC_KEYS = new Set(["items", "en", "sw"])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function toText(value: unknown): string {
  if (typeof value === "string") return value.trim()
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  return ""
}

function labelFromKey(key: string): string {
  return key.replace(/[_-]+/g, " ").trim()
}

function toItem(value: unknown, fallbackLabel = ""): ProductSpecificationItem | null {
  if (!isRecord(value)) return null

  const label = toText(value.label ?? fallbackLabel)
  const parsedValue = toText(value.value)
  const labelSw = toText(value.label_sw ?? value.labelSw)
  const valueSw = toText(value.value_sw ?? value.valueSw)

  if (!label || !parsedValue) return null

  return {
    label,
    value: parsedValue,
    ...(labelSw ? { label_sw: labelSw } : {}),
    ...(valueSw ? { value_sw: valueSw } : {}),
  }
}

function normalizeFromItems(specifications: Record<string, unknown>): ProductSpecificationItem[] {
  if (!Array.isArray(specifications.items)) return []

  const items = specifications.items
    .map((item) => toItem(item))
    .filter((item): item is ProductSpecificationItem => Boolean(item))

  return items
}

function normalizeFromLanguageMaps(specifications: Record<string, unknown>): ProductSpecificationItem[] {
  const englishMap = isRecord(specifications.en) ? specifications.en : null
  const swahiliMap = isRecord(specifications.sw) ? specifications.sw : null

  if (!englishMap && !swahiliMap) {
    return []
  }

  const keys = Array.from(new Set([...Object.keys(englishMap || {}), ...Object.keys(swahiliMap || {})]))

  return keys
    .map((key) => {
      const englishEntry = englishMap?.[key]
      const swahiliEntry = swahiliMap?.[key]

      let label = ""
      let value = ""
      let labelSw = ""
      let valueSw = ""

      if (isRecord(englishEntry)) {
        label = toText(englishEntry.label) || labelFromKey(key)
        value = toText(englishEntry.value)
      } else {
        label = labelFromKey(key)
        value = toText(englishEntry)
      }

      if (isRecord(swahiliEntry)) {
        labelSw = toText(swahiliEntry.label)
        valueSw = toText(swahiliEntry.value)
      } else {
        valueSw = toText(swahiliEntry)
      }

      const resolvedLabel = label || labelSw || labelFromKey(key)
      const resolvedValue = value || valueSw

      if (!resolvedLabel || !resolvedValue) {
        return null
      }

      return {
        label: resolvedLabel,
        value: resolvedValue,
        ...(labelSw ? { label_sw: labelSw } : {}),
        ...(valueSw ? { value_sw: valueSw } : {}),
      } satisfies ProductSpecificationItem
    })
    .filter((item): item is ProductSpecificationItem => Boolean(item))
}

function normalizeFromLegacyFlatObject(specifications: Record<string, unknown>): ProductSpecificationItem[] {
  return Object.entries(specifications)
    .filter(([key]) => !RESERVED_SPEC_KEYS.has(key))
    .map(([key, value]) => {
      if (isRecord(value)) {
        return toItem(value, labelFromKey(key))
      }

      const textValue = toText(value)
      if (!textValue) return null

      return {
        label: labelFromKey(key),
        value: textValue,
      } satisfies ProductSpecificationItem
    })
    .filter((item): item is ProductSpecificationItem => Boolean(item))
}

export function normalizeProductSpecifications(
  specifications: unknown,
  options: NormalizeProductSpecificationsOptions = {},
): ProductSpecificationItem[] {
  if (!isRecord(specifications)) return []

  const explicitItems = normalizeFromItems(specifications)
  if (explicitItems.length > 0) return explicitItems

  const languageMapItems = normalizeFromLanguageMaps(specifications)
  if (languageMapItems.length > 0) return languageMapItems

  if (options.includeLegacyFlatObject) {
    return normalizeFromLegacyFlatObject(specifications)
  }

  return []
}

export function buildProductSpecificationsPayload(
  items: Array<Pick<ProductSpecificationItem, "label" | "value" | "label_sw" | "value_sw">>,
): Record<string, unknown> {
  const normalizedItems = items
    .map((item) => {
      const label = toText(item.label)
      const value = toText(item.value)
      const labelSw = toText(item.label_sw)
      const valueSw = toText(item.value_sw)

      if (!label || !value) {
        return null
      }

      return {
        label,
        value,
        ...(labelSw ? { label_sw: labelSw } : {}),
        ...(valueSw ? { value_sw: valueSw } : {}),
      } satisfies ProductSpecificationItem
    })
    .filter((item): item is ProductSpecificationItem => Boolean(item))

  if (normalizedItems.length === 0) {
    return {}
  }

  return { items: normalizedItems }
}
