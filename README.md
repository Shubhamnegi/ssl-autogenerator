# ssl-autogenerator

## Goal
Goal is to register a new domain, and create a certificate on a defined interval. Application will use sslforfree to register, validate and create new certificate. Once a certificate is generated it will be uploaded to the proxy server using queue.

To renew a certificate an external service will trigger a check for validity of all the certificates.