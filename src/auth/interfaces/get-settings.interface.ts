export interface GetSettingsInterface {
  name: string;
  gender: {
    id: number;
    gender_name: string;
  };
  country_name: string;
  date_name: string;
  instagram: string;
  gender_preference: number;
  interested_in: {
    id: number;
    name: string;
  };
  canEditLocation: boolean;
}
