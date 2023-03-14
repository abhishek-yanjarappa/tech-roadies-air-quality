export default function getSummary(aqi: number) {
  if (aqi >= 0 && aqi <= 50) {
    return "Good air quality. No health impacts are expected.";
  } else if (aqi >= 51 && aqi <= 100) {
    return "Moderate air quality. Unusually sensitive individuals should consider limiting prolonged outdoor exertion.";
  } else if (aqi >= 101 && aqi <= 150) {
    return "Unhealthy for sensitive groups. Children, the elderly, and those with respiratory or heart conditions should limit prolonged outdoor exertion.";
  } else if (aqi >= 151 && aqi <= 200) {
    return "Unhealthy. Everyone may begin to experience some adverse health effects, and sensitive groups should avoid prolonged outdoor exertion.";
  } else if (aqi >= 201 && aqi <= 300) {
    return "Very unhealthy. Everyone may experience more serious health effects, and outdoor exertion should be avoided.";
  } else if (aqi >= 301 && aqi <= 500) {
    return "Hazardous. Everyone may experience even more serious health effects, and outdoor exertion should be avoided at all costs.";
  } else {
    return "Invalid AQI value.";
  }
}
