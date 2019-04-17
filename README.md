# SYNOPSIS

⏱ Scheduled job to capture and save the results of api-backwardango in BigQuery.

## REQUIREMENTS

1. A Google Cloud Account.
2. Billing Enabled.
3. API Access Enabled.
4. `gcloud` CLI installed and in your `$PATH`.
5. A preferred configuration created ( `gcloud init` ).

## USAGE

This cloud function is intended to be run as a scheduled job but you could request it as typical HTTP API.

## DEPLOY

First, fork or clone this repo, then:

```sh
npm i
```

You need to pass in your [environment variables either in a `.env.yaml` file or as command line arguements](https://cloud.google.com/functions/docs/env-var) for dataset name and table name.  

For example, you need the following in your `.env.yaml` file:

```yaml
DATASET: "XXX"
TABLE_NAME: "YYY"
```

Now, deploy it GCP, run the following command in the root of this repository:

```sh
gcloud functions deploy api-scheduled-backwardango --runtime nodejs10 --trigger-http --memory 128MB --env-vars-file .env.yaml
```

You should receive a YAML like response in your terminal including the URL for the Cloud Function.

## TESTS

```sh
npm i -D
DEBUG=api:scheduled:backwardango DATASET={YOUR-DATASET-NAME} TABLE_NAME={YOUR-TABLE-NAME} npm test
```

## AUTHORS

- [Joe McCann](https://twitter.com/joemccann)

## LICENSE

MIT