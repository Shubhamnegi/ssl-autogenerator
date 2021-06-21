# ssl-autogenerator

## Goal
Goal is to register a new domain, and create a certificate on a defined interval. Application will use sslforfree to register, validate and create new certificate. Once a certificate is generated it will be uploaded to the proxy server using queue.

To renew a certificate an external service will trigger a check for validity of all the certificates.

## Implementation

### Issuer

At the moment we are using only zerossl (sslforfree). Zero ssl provides api from creating certificates. Check out the API documentation [here](https://zerossl.com/documentation/api/).
List of api's we are using
- Create certificate
- Validate certificate
- Check validation status
- Download certificate zip
- Get certificate  (extra) 
- List certificate (extra) 

### Business Logic
- Register a domain in db with corresponding csr request. Auto set exipry data to 90 days from current date.
- Create Certificate using ssl api and update certificate hash, private key and csr in database.
- Create a validation file using response of create certificate and push to queue so that it can be places on ha proxy. This is required by zero ssl for validation under /.well-known path. For queue selection we are using database itself.
- Request validation using ssl api  
- Check for validation status
- If validation is successfull, download certificate, upload to s3, update db with certificate and ca bundle, and push to queue. For queue selection we are using dabtabase itself. On recieving the packet ha proxy will create a pem file and store
- Use cron to check if domain is expiring and push for renewal


### API
- POST "/api/v1/register" - To register new domain
- POST "/api/v1/renew" - To renew domains. Uses query to check domains which are expiring in next 10 days.


## Structure
- Connections - Create database connection
- Constants - Application constants
- Consumers - SQS consumers, polls delayed queue, Included base consumer
- Declarations - interfaces for application
- Errors - Application Errors
- Helpers - Functional application helpers
- Models - DB models
- Repository - database repository
- Routes - http routes
- Services - Application services to be used in routes
- Test - Application test cases includes database, helpers and service 
- Validators - Incoming request validators 
- Vendors - ssl vendors
