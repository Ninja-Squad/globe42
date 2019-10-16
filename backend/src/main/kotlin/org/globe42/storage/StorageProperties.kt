package org.globe42.storage

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding
import org.springframework.validation.annotation.Validated
import java.io.File
import javax.validation.constraints.NotBlank

/**
 * Class containing the globe42 google cloud storage properties
 * @author JB Nizet
 */
@ConfigurationProperties(prefix = "globe42.google-cloud-storage")
@ConstructorBinding
@Validated
data class StorageProperties(
    /**
     * The JSON string containing the credentials. Typically used in production on clever cloud, when there is no file,
     * but where the JSON can be stored in an environment variable.
     */
    val credentials: String? = null,

    /**
     * The path to the JSON file containing the credentials. Only used if [.credentials] is not specified.
     * Typically used in dev mode, where specifying a file path in a command-line property is easier.
     */
    val credentialsPath: File? = null,

    /**
     * The bucket name
     */
    @field:NotBlank val bucket: String? = null
)
