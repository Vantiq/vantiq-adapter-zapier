# Zapier Connector

The Zapier connector provides support for connecting to 3rd party systems through
[Zapier](https://zapier.com/) using the Vantiq app on Zapier.  Zapier is a 
cloud-based service that automates Web APIs.  The Vantiq Zapier connector provides 
bi-directional communication between Vantiq and the services exposed through Zapier.

## Dependencies

- [Vantiq connector common](https://github.com/Vantiq/vantiq-connector-common)

Note: The Zapier connector itself provides connectivity between Vantiq and Zapier.  
One or more adapters are required that define the specific data types and control
actions associated with the services exposed through Zapier.

## Install

This Zapier connector consists of the _Vantiq App_ defined in Zapier and connector
in Vantiq.

### Zapier App

The _Vantiq App_ is available by invitation from Vantiq at [Zapier](https://zapier.com]).

### Connector

The Zapier connector can be imported into a Vantiq namespace through the CLI:

    % git clone https://github.com/Vantiq/vantiq-connector-Zapier.git
    % cd vantiq-connector-Zapier/vantiq
    % vantiq -s <profile> import

where `<profile>` provides the credentials for the Vantiq CLI.

## Vantiq Zapier App

To create an integration between Vantiq and Zapier, the Vantiq Zapier app must be used.  The
app supports the *Publish Data* action that allows data from external systems to trigger
data to be pushed into Vantiq.

### *Publish Data* Action 

When creating a Zap that uses the *Publish Data* action, the following steps are required:

#### Select Vantiq Account

To connect to Vantiq, the user must provide:

* `Vantiq System URL`: The system to connect to.  Typically, this will be the production Vantiq server.
* `Username`: The username used to authenticate into the specified Vantiq system.
* `Password`: The password used to authenticate into the specified Vantiq system.

#### Action Template

The template for the *Publish Data* provides the details of what data is 
to be published into Vantiq:

* `Type`: This is the Vantiq data type that is being provided.  This is a 
dynamic drop down that is populated by connecting to the given Vantiq
system.
* `Content Mapping Prefix`: This provides a way for the Zap caller to provide a prefix
to the {{fields}} used to map data from the 3rd party to Vantiq.  Typically, this should be
left blank as the field names in Vantiq should be the same as the field names from the 3rd
party system.  However, there are cases when this is not true.  For example, when mapping
SalesForce Accounts through an Outbound Message, the prefix of `Notification__sObject__` must
be used.
* `Content`: This is the mapping of the data from the 3rd party system trigger.  By using the
drop-down, the content can be dynamically loaded based on the Vantiq data type automatically.
If that doesn't work for some reason, the mapping can be provided explicitly.
* `Topic`: The topic should be left as a the default (`/system/connector/Zapier/inbound`).

## Content Mappings

Every type of data that is integrated through Zapier requires a mapping that is populated
in the `content` field when creating a Zap.  By default, the content mappings can be looked
up during the setup of the Zap based on the Vantiq Data Type selected.  This allows changes
to the Vantiq Data Type to be automatically reflected through Zapier.
