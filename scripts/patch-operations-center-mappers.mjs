#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const src = readFileSync(join(root, "src/modules/database/lib/integration-platform-mappers.ts"), "utf8");

const reps = [
    [/integration-platform/g, "operations-center"],
    [/IntegrationHub/g, "OperationsCenter"],
    [/integrationHub/g, "operationsCenter"],
    [/IntegrationHubs/g, "OperationsCenters"],
    [/integrationHubs/g, "operationsCenters"],
    [/Intg/g, "Eoc"],
    [/intg/g, "eoc"],
    [/hub_id/g, "center_id"],
    [/hub_name/g, "center_name"],
    [/hub_key/g, "center_key"],
    [/hubName/g, "centerName"],
    [/hubKey/g, "centerKey"],
    [/DbIntg/g, "DbEoc"],
    [/ConnectedService/g, "OverallHealth"],
    [/connectedService/g, "overallHealth"],
    [/connectedServices/g, "overallHealth"],
    [/PaymentConnector/g, "JobScheduler"],
    [/paymentConnector/g, "jobScheduler"],
    [/paymentConnectors/g, "jobSchedulers"],
    [/AccountingConnector/g, "PlatformEvent"],
    [/accountingConnector/g, "platformEvent"],
    [/accountingConnectors/g, "platformEvents"],
    [/PaymentRetryQueue/g, "JobRetryQueue"],
    [/paymentRetryQueue/g, "jobRetryQueue"],
    [/PaymentTransaction/g, "Alert"],
    [/paymentTransaction/g, "alert"],
    [/paymentTransactions/g, "alerts"],
    [/ConnectorHealth/g, "ModuleHealth"],
    [/connectorHealth/g, "moduleHealth"],
    [/IntegrationHealth/g, "OperationsHealth"],
    [/integrationHealth/g, "operationsHealth"],
    [/IntegrationFailure/g, "OperationsFailure"],
    [/integrationFailure/g, "operationsFailure"],
    [/integrationFailures/g, "operationsFailures"],
    [/IntegrationMetric/g, "OperationsMetric"],
    [/integrationMetric/g, "operationsMetric"],
    [/connector_status/g, "scheduler_status"],
    [/connectorStatus/g, "schedulerStatus"],
    [/provider_type/g, "health_type"],
    [/providerType/g, "healthType"],
    [/transaction_status/g, "alert_status"],
    [/transactionStatus/g, "alertStatus"],
    [/buildIntegrationHubLookupMaps/g, "buildOperationsCenterLookupMaps"],
    [/Integration pipeline/g, "Operations pipeline"],
    [/configured.*connected.*syncing.*active.*degraded/g, "monitoring • healthy • degraded • critical"],
];

let out = src;
for (const [from, to] of reps) out = out.replace(from, to);

// Remove queue health mapper exports if any leaked
out = out.replace(/buildQueueHealthPayload[\s\S]*?mapQueueHealthSummary[\s\S]*?\n\n/g, "");

writeFileSync(join(root, "src/modules/database/lib/operations-center-mappers.ts"), out, "utf8");
console.log("Generated operations-center-mappers.ts");
