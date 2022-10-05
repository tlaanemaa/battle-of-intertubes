import { container } from "@moose-rocket/container";
import { injectable } from "inversify";

// FIXME: Move this somewhere else
const knownUsers: { [key: string]: string } = {
  banana: "45c993a5-f1bd-4bb9-b6a7-e543b3f80560",
};

@injectable()
export class Authentication {
  /**
   * Returns the user ID if the user is recognized, or null if they're not
   */
  public authenticateUser(authHeader?: string): string | null {
    if (!(typeof authHeader === "string")) return null;

    const [authType, base64AuthToken] = authHeader.split(" ");
    if (authType !== "Basic" || typeof base64AuthToken !== "string")
      return null;

    const [username, password] = Buffer.from(base64AuthToken, "base64")
      .toString()
      .split(":");

    if (knownUsers[username] && knownUsers[username] === password) {
      return username;
    }

    return null;
  }
}

container.bind(Authentication).toSelf().inSingletonScope();
