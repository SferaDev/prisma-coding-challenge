import { Octokit } from "octokit";

export async function crossUserOrganizations(token: string, orgs: string[]) {
    const octokit = new Octokit({ auth: token });

    try {
        const { data: userOrgs } = await octokit.rest.orgs.listForUser({ username: "SferaDev" });
        const orgsWithMembership = userOrgs.filter(org => orgs.includes(org.login));

        return orgsWithMembership.length > 0;
    } catch (error: any) {
        console.error(error);
        return false;
    }
}
