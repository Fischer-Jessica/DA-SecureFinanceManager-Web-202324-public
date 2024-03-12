/**
 * Interface for the application configuration.
 * Specifies the structure of the configuration object containing API URL.
 * @interface ApplicationConfig
 */
export interface ApplicationConfig {
  apiURL: string;
}

/**
 * Configuration object for the application.
 * Contains the API URL used throughout the application.
 * @const CONFIG
 */
export const CONFIG: ApplicationConfig = {
  apiURL: 'http://localhost:8080/secure-finance-manager/'
};
