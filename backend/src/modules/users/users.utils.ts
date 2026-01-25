export const redactFields = (
  obj: any,
  fields = ["password", "accessToken"],
): any => {
  if (obj == null) return obj;
  if (Array.isArray(obj)) return obj.map((o) => redactFields(o, fields));
  if (typeof obj !== "object") return obj;
  const copy = { ...obj };
  for (const f of fields) {
    if (f in copy) delete copy[f];
  }
  for (const k of Object.keys(copy)) {
    copy[k] = redactFields(copy[k], fields);
  }
  return copy;
};
