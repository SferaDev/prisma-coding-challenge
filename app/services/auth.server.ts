import { Authenticator } from "remix-auth";
import { GitHubStrategy } from "remix-auth-github";
import { User, UserActions } from "~/models/User";
import { sessionStorage } from "~/services/session.server";
import { crossUserOrganizations } from "./octokit.server";

export const authenticator = new Authenticator<User>(sessionStorage);

const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
if (!clientID || !clientSecret) throw new Error("GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET is not set");

const gitHubStrategy = new GitHubStrategy<User>(
    {
        clientID,
        clientSecret,
        callbackURL: `${process.env.BASE_URL}/auth/github/callback`,
    },
    async ({ profile, accessToken }) => {
        // Pre-activate users by their organization membership
        const preactivate = await crossUserOrganizations(accessToken, [
            "remix-run",
            "prisma",
            "EyeSeeTea",
            "github",
            "primer",
        ]);

        const user = await UserActions.getOrCreate({
            name: profile.displayName,
            email: profile.emails[0].value,
            active: preactivate,
        });

        return user;
    }
);

authenticator.use(gitHubStrategy);
