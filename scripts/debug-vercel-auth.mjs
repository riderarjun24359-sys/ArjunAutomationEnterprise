const token = process.env.VERCEL_TOKEN;
const orgId = process.env.VERCEL_ORG_ID;
const projectId = process.env.VERCEL_PROJECT_ID;

console.log("Token length:", token ? token.length : "MISSING");
console.log("Org ID:", orgId);
console.log("Project ID:", projectId);

async function check() {
    try {
        const response = await fetch("https://api.vercel.com/v2/user", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        console.log("User check:", response.status, await response.text());
        
        const projResponse = await fetch(`https://api.vercel.com/v9/projects/${projectId}?teamId=${orgId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        console.log("Project check:", projResponse.status, await projResponse.text());
    } catch (e) {
        console.error("Error:", e);
    }
}
check();
