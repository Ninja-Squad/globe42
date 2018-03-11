package org.globe42.storage;

import java.io.File;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Class containing the globe42 google cloud storage properties
 * @author JB Nizet
 */
@ConfigurationProperties(prefix = "globe42.google-cloud-storage")
public class StorageProperties {
    /**
     * The JSON string containing the credentials. Typically used in production on clever cloud, when there is no file,
     * but where the JSON can be stored in an environment variable.
     */
    private String credentials;

    /**
     * The path to the JSON file containing the credentials. Only used if {@link #credentials} is not specified.
     * Typically used in dev mode, where specifying a file path in a command-line property is easier.
     */
    private File credentialsPath;

    public String getCredentials() {
        return credentials;
    }

    public void setCredentials(String credentials) {
        this.credentials = credentials;
    }

    public File getCredentialsPath() {
        return credentialsPath;
    }

    public void setCredentialsPath(File credentialsPath) {
        this.credentialsPath = credentialsPath;
    }
}
