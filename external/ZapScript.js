var Zap = {
    //
    // Include the "action" that is being requested from Vantiq.
    //
    pre_subscribe: function(bundle) {
        console.log("pre_subscribe: " + JSON.stringify(bundle, null, 2));
        
        //
        // Create the subscription payload that includes the action
        //
        bundle.request.data = JSON.stringify({
            subscription_url: bundle.subscription_url,
            target_url: bundle.target_url,
            event: bundle.event,
            action: bundle.trigger_fields.action
        });
        
        return bundle.request;
    },

    //
    // Preprocess the control action drop down using the query
    // to return all the possible control actions in Vantiq.
    //
    controlActionDropDown_pre_poll: function(bundle) {
        console.log("controlActionDropDown_pre_poll: " + JSON.stringify(bundle, null, 2));
        bundle.request.method = "POST";
        bundle.request.data = "{}";
        return bundle.request;
    },

    //
    // Preprocess the content mapping drop down using the POST
    // to perform the execution of the procedure in Vantiq.
    //
    contentMappingDropDown_pre_poll: function(bundle) {
        console.log("contentMappingDropDown_pre_poll: " + JSON.stringify(bundle, null, 2));
        
        var type = bundle.trigger_fields.type;
        var prefix = bundle.trigger_fields.contentMappingPrefix;
        
        bundle.request.method = "POST";
        bundle.request.data = JSON.stringify({ dataTypeName: type, prefix: prefix });        
        return bundle.request;
    },

    //
    // Preprocesses the request before publishing data to Vantiq.
    //
    // Since Zapier does not expose the raw requests from the source,
    // we need to use a template with [[{{var}}]].  The resulting
    // JSON-like document is provided in the "content" variable
    // in string form with fields that have been replaced with values
    // that look like:
    //
    //    [X[...some value...]]
    //
    // where X is one of B for boolean, S for string, D for datetime,
    // O for object, and N for numeric.  We need to ensure that the values
    // are replaced as legal JSON values.
    //
    PublishData_pre_write: function(bundle) {
        console.log("PublishData_pre_write: " + JSON.stringify(bundle, null, 2));
        
        var SEPARATOR = /(\[[BSNDO]\[|\]\])/;

        //
        // The "content" field is a string and not legal JSON, so we
        // need to parse the data within the [[ ]] separators using
        // regular expressions.  Any data within the separates are processed
        // based on the type defined by the leading separator (e.g.
        // [B[ means boolean, [S[ means string, etc.)
        //
        var arr = bundle.action_fields.content.split(SEPARATOR);
        if(arr.length > 1) {

            var result = [];
            for(var i=0; i<arr.length; i++) {

                // Only look for values enclosed by the leading and trailing separator
                if(arr[i].match(/\[[BSNDO]\[/) && arr[i+2] === ']]') {
                    var value = arr[i+1];

                    //
                    // Handle the different data types.  Note that there may
                    // be an empty value, which means for most types a null value.
                    //        
                    switch(arr[i]) {
                        case "[B[": // Boolean Fields
                            if(value === '') {
                                result.push('null');
                            } else {
                                result.push(value.toLowerCase());
                            }
                            break;
                        case "[S[": // String Fields
                            result.push(JSON.stringify(arr[i+1]));
                            break;
                        case "[D[": // Date Fields
                            if(value === '') {
                                result.push('null');
                            } else {
                                result.push(JSON.stringify(arr[i+1]));
                            }
                            break;
                        case "[N[": // Numeric Fields
                            if(value === '') {
                                result.push('null');
                            } else {
                                result.push(value);
                            }
                            break;
                        case "[O[": // Object Fields
                            if(value === '') {
                                result.push('null');
                            } else {
                                result.push(JSON.stringify(arr[i+1]));
                            }
                            break;
                    }

                    // Increment the index past the value and the
                    // closing separate
                    i += 2;

                } else {

                    // All other parts of the value just needs to be
                    // replaced intact.
                    result.push(arr[i]);
                }

            }

            // The content field is reconstructed by just joining the results.
            bundle.action_fields.content = result.join("");
        }

        // The full request is just the action_fields object.
        bundle.request.data = JSON.stringify(bundle.action_fields);        
        return bundle.request;
    }
};