import axios from "axios";

export interface RkiData {
  rs: string;
  name: string;
  lastUpdate: string;
  incidence: number;
  cases: number;
}

export async function fetchData(): Promise<RkiData[]> {
  const response = await axios.get(`https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=RS,EWZ,county,last_update,BL,cases7_per_100k,cases&returnGeometry=false&outSR=4326&f=json`)
  return response.data.features.map((feature: any) => {
    const attributes = feature.attributes;
    const lastUpdate = attributes.last_update.substring(0, "00.00.0000".length);
    return ( {
      rs: attributes.RS,
      name: attributes.county,
      incidence: attributes.cases7_per_100k,
      cases: attributes.cases,
      lastUpdate
    } );
  })
}
