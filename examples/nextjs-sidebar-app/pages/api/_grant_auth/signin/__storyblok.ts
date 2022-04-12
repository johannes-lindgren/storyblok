import grant from "grant";
import {grantConfig} from "@src/grant-config";

export default async function handle(res, req) {
    const a  = await grant.vercel(grantConfig)(res, req)
    console.log(a.session)
}

