#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
let t = readFileSync(join(root, "src/modules/operations-center/types/index.ts"), "utf8");
const reps = [
    [/Intg/g, "Eoc"],
    [/IntegrationHub/g, "OperationsCenter"],
    [/integrationHub/g, "operationsCenter"],
    [/Integration Hubs/g, "Operations Centers"],
    [/ConnectedService/g, "OverallHealth"],
    [/connectedService/g, "overallHealth"],
    [/PaymentConnector/g, "JobScheduler"],
    [/paymentConnector/g, "jobScheduler"],
    [/AccountingConnector/g, "PlatformEvent"],
    [/accountingConnector/g, "platformEvent"],
    [/PaymentRetryQueue/g, "JobRetryQueue"],
    [/paymentRetryQueue/g, "jobRetryQueue"],
    [/PaymentTransaction/g, "Alert"],
    [/paymentTransaction/g, "alert"],
    [/ConnectorConfig/g, "DatabaseHealth"],
    [/connectorConfig/g, "databaseHealth"],
    [/ConnectorHealth/g, "ModuleHealth"],
    [/connectorHealth/g, "moduleHealth"],
    [/IntegrationMetric/g, "OperationsMetric"],
    [/integrationMetric/g, "operationsMetric"],
    [/IntegrationHealth/g, "OperationsHealth"],
    [/integrationHealth/g, "operationsHealth"],
    [/IntegrationFailure/g, "OperationsFailure"],
    [/integrationFailure/g, "operationsFailure"],
    [/hubKey/g, "centerKey"],
    [/hubName/g, "centerName"],
    [/providerType/g, "healthType"],
    [/connectorStatus/g, "schedulerStatus"],
    [/transactionStatus/g, "alertStatus"],
    [/IntgSdkConnectService/g, "EocSdkPublishEvent"],
    [/IntgSdkIssueApiKey/g, "EocSdkScheduleJob"],
    [/IntgSdkRegisterWebhook/g, "EocSdkTriggerAlert"],
    [/serviceKey/g, "eventKey"],
    [/serviceName/g, "eventName"],
    [/keyName/g, "schedulerName"],
    [/webhookKey/g, "alertKey"],
    [/webhookName/g, "alertTitle"],
    [/targetUrl/g, "alertMessage"],
    [/connectedServiceCount/g, "overallHealthCount"],
    [/activeConnectorCount/g, "activeJobCount"],
    [/failedTransactionCount/g, "openAlertCount"],
    [/totalIntegrationHubs/g, "totalOperationsCenters"],
    [/activeIntegrationHubs/g, "activeOperationsCenters"],
];
for (const [a, b] of reps) t = t.replace(a, b);
writeFileSync(join(root, "src/modules/operations-center/types/index.ts"), t, "utf8");
console.log("Patched operations-center types");
