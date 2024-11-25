export default {
    handleRowSelection: async (selectedRow) => {
        if (selectedRow) {
            // Log the selected row for debugging
            console.log("Selected Row:", selectedRow);
            // Extract the required details
            const { use_case, changed_data } = selectedRow;
            // Check if changed_data exists and is a valid JSON string
            if (changed_data) {
                // Attempt to parse changed_data
                const parsedData = JSON.parse(changed_data);
                console.log("Parsed Data:", parsedData);
                // Check if parsedData is defined and contains the necessary fields
                if (!parsedData) {
                    showAlert("Parsed data is empty.", "error");
                    return;
                }
                // SQL query string generation
                let query = "";
                let auditQuery = "";
                switch (use_case) {
                    case "usecase1":
                        query = `
                            UPDATE custdb.Users 
                            SET 
                                ip_validation = ${parsedData.ip_validation},
                                Lounge_DLT = ${parsedData.Lounge_DLT},
                                erp_mdate = '${parsedData.erp_mdate.replace(/'/g, "''")}'
                            WHERE 
                                esmeaddr = '${parsedData.esmeaddr}';
                        `;
                        auditQuery = `
                            INSERT INTO audit_log (table_name, operation, old_data, new_data, updated_by, updated_at)
                            VALUES (
                                'Users', 
                                'update',
                                '{{ JSON.stringify(usecase1old.data) }}', 
                                '{{ JSON.stringify({
                                    ip_validation: JSON.parse(pending_approvals.selectedRow.changed_data).ip_validation,
                                    Lounge_DLT: JSON.parse(pending_approvals.selectedRow.changed_data).Lounge_DLT,
                                    erp_mdate: moment(JSON.parse(pending_approvals.selectedRow.changed_data).erp_mdate).format("YYYY-MM-DD HH:mm:ss")
                                }) }}', 
                                '{{ appsmith.store.loggedInUserName }}', 
                                NOW()
                            );
                        `;
                        break;
                    case "usecase2":
                        query = `
                            UPDATE IREPDB.PDB_URLRule 
                            SET 
                                token_url = ${parsedData.token_url.replace(/'/g, "''")},
                                api_header_token = ${parsedData.api_header_token.replace(/'/g, "''")},
                                token_expire_time = ${parsedData.token_expire_time.replace(/'/g, "''")},
                                token_expire_err_code = ${parsedData.token_expire_err_code.replace(/'/g, "''")},
                                auth_enabled = ${parsedData.auth_enabled},
                                token_url_method_type = ${parsedData.token_url_method_type.replace(/'/g, "''")}
                            WHERE 
                                I_RuleID = ${parsedData.I_RuleID.replace(/'/g, "''")};
                        `;
                        auditQuery = `
                            INSERT INTO audit_log (table_name, operation, old_data, new_data, updated_by, updated_at)
                            VALUES (
                                'PDB_URLRule', 
                                'update',
                                '{{ JSON.stringify(usecase2fetchold.data) }}', 
                                '{{ JSON.stringify({
                                    token_url: JSON.parse(pending_approvals.selectedRow.changed_data).token_url,
                                    api_header_token: JSON.parse(pending_approvals.selectedRow.changed_data).api_header_token,
                                    token_expire_time: JSON.parse(pending_approvals.selectedRow.changed_data).token_expire_time,
                                    token_expire_err_code: JSON.parse(pending_approvals.selectedRow.changed_data).token_expire_err_code,
                                    auth_enabled: JSON.parse(pending_approvals.selectedRow.changed_data).auth_enabled,
                                    token_url_method_type: JSON.parse(pending_approvals.selectedRow.changed_data).token_url_method_type
                                }) }}', 
                                '{{ appsmith.store.loggedInUserName || "unknown" }}', 
                                NOW()
                            );
                        `;
                        break;
                    case "usecase3":
                        query = `
                            INSERT INTO IREPDB.token_updater_rule 
                            (esme_addr, rule_id, url, params, method_type, request_type, token_expiry_time_in_sec) 
                            VALUES 
                            (${parsedData.esme_addr.replace(/'/g, "''")}, 
                            ${parsedData.rule_id.replace(/'/g, "''")}, 
                            ${parsedData.url.replace(/'/g, "''")}, 
                            ${parsedData.params.replace(/'/g, "''")}, 
                            ${parsedData.method_type.replace(/'/g, "''")}, 
                            ${parsedData.request_type.replace(/'/g, "''")}, 
                            ${parsedData.token_expiry_time_in_sec});
                        `;
                        auditQuery = `
                            INSERT INTO audit_log (table_name, operation, old_data, new_data, updated_by, updated_at)
                            VALUES (
                                'token_updater_rule', 
                                'insert', 
                                NULL, 
                                '{{ JSON.stringify({
                                    esme_addr: JSON.parse(pending_approvals.selectedRow.changed_data).esme_addr,
                                    rule_id: JSON.parse(pending_approvals.selectedRow.changed_data).rule_id,
                                    url: JSON.parse(pending_approvals.selectedRow.changed_data).url,
                                    params: JSON.parse(pending_approvals.selectedRow.changed_data).params,
                                    method_type: JSON.parse(pending_approvals.selectedRow.changed_data).method_type,
                                    request_type: JSON.parse(pending_approvals.selectedRow.changed_data).request_type,
                                    token_expiry_time_in_sec: JSON.parse(pending_approvals.selectedRow.changed_data).token_expiry_time_in_sec
                                }) }}', 
                                '{{ appsmith.store.loggedInUserName || "unknown" }}', 
                                NOW()
                            );
                        `;
                        break;
                    case "usecase4":
                        query = `
                            UPDATE IREPDB.PDB_URLRule 
                            SET 
                                timestamp_format = '${parsedData.timestamp_format.replace(/'/g, "''")}', 
                                http_connection_timeout_inmills = ${parsedData.http_connection_timeout_inmills}
                            WHERE 
                                I_RuleID = '${parsedData.i_RuleId.replace(/'/g, "''")}';
                        `;
                        auditQuery = `
                            INSERT INTO audit_log (table_name, operation, old_data, new_data, updated_by, updated_at)
                            VALUES (
                                'PDB_URLRule', 
                                'update',
                                '{{ JSON.stringify(usecase4old.data) }}', 
                                '{{ JSON.stringify({
                                    timestamp_format: JSON.parse(pending_approvals.selectedRow.changed_data).timestamp_format,
                                    http_connection_timeout_inmills: JSON.parse(pending_approvals.selectedRow.changed_data).http_connection_timeout_inmills
                                }) }}', 
                                '{{ appsmith.store.loggedInUserName || "unknown" }}', 
                                NOW()
                            );
                        `;
                        break;
                    default:
                        showAlert("Unknown use case selected", "warning");
                        return;
                }
                // Log the generated query and audit query to verify it
                console.log("Generated Query: ", query);
                console.log("Generated Audit Query: ", auditQuery);

                // Trigger the Appsmith query based on the use case
                let queryResponse;
                let auditResponse;

                if (use_case === "usecase1") {
                    queryResponse = await updateQuery.run(); // Assuming `updateQuery` is an Appsmith query action
                    auditResponse = await auditusecase1.run(); // Execute audit query
                } else if (use_case === "usecase2") {
                    queryResponse = await usecase2query.run(); // Assuming `usecase2query` is an Appsmith query action
                    auditResponse = await usecase2audit.run(); // Execute audit query
                } else if (use_case === "usecase3") {
                    queryResponse = await usecase3query.run(); // Assuming `usecase3query` is an Appsmith query action
                    auditResponse = await auditusecase3.run(); // Execute audit query
                } else if (use_case === "usecase4") {
                    queryResponse = await usecase4Query.run(); // Assuming `usecase4Query` is an Appsmith query action
                    auditResponse = await audittusecase4.run(); // Execute audit query
                }

                // Log the query response for debugging
                if (queryResponse && queryResponse.success && auditResponse && auditResponse.success) {
                    showAlert("Query and audit log executed successfully!", "success");
                }
            } else {
                console.log("Changed data is empty or missing.");
                showAlert("Changed data is missing or malformed.", "error");
            }
        } else {
            showAlert("Please select a row from the table.", "warning");
        }
    },
};
