export const getChatId = (uid1, uid2) => {
  if (!uid1 || !uid2) return null;

  return uid1 < uid2
    ? `${uid1}_${uid2}`
    : `${uid2}_${uid1}`;
};
