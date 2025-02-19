# artillery-performance-test

## Run command
artillery run tests/script.yml

## To debug HTTP requests: DEBUG=http
DEBUG=http artillery run tests/script.yml

## To select an env: -e
artillery run -e dev tests/script.yml

## Secrets and env files:
### Create .env files for each env
It will be easier to use .evn files in the local development, collect required vars and stored them in .env files for dev, int and stage environments.

### To use: --dotenv
artillery run --dotenv ./{{ env }}.env tests/script.yml

## To generate a json as output: --output
artillery run --output reports/report.json tests/script.yml

## To use a separate configuration file: --config
artillery run --config tests/config.yml tests/script.yml

## Example all together
DEBUG=http artillery run -e int --dotenv ./int.env --output reports/report.json --config tests/myhost/config.yml tests/myhost/flow/myflow.yml

## To Generate HTML report based on the json report
artillery report reports/report.json

## To install plugins for example use npm (install npm prior)
- npm install artillery-plugin-expect
- npm install uuid