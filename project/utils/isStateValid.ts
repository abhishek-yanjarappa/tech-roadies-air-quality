export const isLatLonValid = (lat: string, lon: string): boolean => {
  const latNumber = parseFloat(lat);
  const lonNumber = parseFloat(lon);
  return (
    /^-?\d*(\.\d+)?$/.test(lat) &&
    /^-?\d*(\.\d+)?$/.test(lon) &&
    !isNaN(latNumber) &&
    latNumber >= -90 &&
    latNumber <= 90 &&
    !isNaN(lonNumber) &&
    lonNumber >= -180 &&
    lonNumber <= 180
  );
};
