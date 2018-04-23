package org.globe42.storage

import com.google.auth.oauth2.GoogleCredentials
import com.google.cloud.storage.Storage
import com.google.cloud.storage.StorageOptions
import org.slf4j.LoggerFactory
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.io.IOException
import java.io.InputStream
import java.nio.charset.StandardCharsets

/**
 * Config class for Google Cloud Storage beans. See the README for useful links regarding Google Cloud Storage.
 * @author JB Nizet
 */
@Configuration
@EnableConfigurationProperties(StorageProperties::class)
class StorageConfig(private val properties: StorageProperties) {

    @Bean
    @Throws(IOException::class)
    fun storage(): Storage {
        fun InputStream.toStorage() = StorageOptions
            .newBuilder()
            .setCredentials(GoogleCredentials.fromStream(this))
            .build()
            .service

        properties.credentials?.let {
            LOGGER.info("Property globe42.google-cloud-storage.credentials is set." + " Using its value as Google Cloud Storage JSON credentials")
            val inputStream = it.toByteArray(StandardCharsets.UTF_8).inputStream()
            return inputStream.toStorage()
        }

        properties.credentialsPath?.let { file ->
            LOGGER.info("Property globe42.google-cloud-storage.credentials-path is set." + " Using its value as a JSON file path to the Google Cloud Storage credentials")
            return file.inputStream().use { inputStream ->
                inputStream.toStorage()
            }
        }

        LOGGER.warn("Neither property globe42.google-cloud-storage.credentials nor globe42.google-cloud-storage.credentials-path is set." + " Using default instance credentials.")
        return StorageOptions.getDefaultInstance().service
    }

    companion object {
        @JvmStatic
        private val LOGGER = LoggerFactory.getLogger(StorageConfig::class.java)
    }
}
