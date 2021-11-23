/* tslint:disable */
/* eslint-disable */
/**
 * Sifchain - gRPC Gateway docs
 * A REST interface for state queries, legacy transactions
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from "../runtime";
import {
  ClientStateAssociatedWithTheRequestIdentifier,
  ClientStateAssociatedWithTheRequestIdentifierFromJSON,
  ClientStateAssociatedWithTheRequestIdentifierFromJSONTyped,
  ClientStateAssociatedWithTheRequestIdentifierToJSON,
  HeightAtWhichTheProofWasRetrieved,
  HeightAtWhichTheProofWasRetrievedFromJSON,
  HeightAtWhichTheProofWasRetrievedFromJSONTyped,
  HeightAtWhichTheProofWasRetrievedToJSON,
} from "./";

/**
 * QueryClientStateResponse is the response type for the Query/ClientState RPC
 * method. Besides the client state, it includes a proof and the height from
 * which the proof was retrieved.
 * @export
 * @interface IbcCoreClientV1QueryClientStateResponse
 */
export interface IbcCoreClientV1QueryClientStateResponse {
  /**
   *
   * @type {ClientStateAssociatedWithTheRequestIdentifier}
   * @memberof IbcCoreClientV1QueryClientStateResponse
   */
  clientState?: ClientStateAssociatedWithTheRequestIdentifier;
  /**
   *
   * @type {string}
   * @memberof IbcCoreClientV1QueryClientStateResponse
   */
  proof?: string;
  /**
   *
   * @type {HeightAtWhichTheProofWasRetrieved}
   * @memberof IbcCoreClientV1QueryClientStateResponse
   */
  proofHeight?: HeightAtWhichTheProofWasRetrieved;
}

export function IbcCoreClientV1QueryClientStateResponseFromJSON(
  json: any,
): IbcCoreClientV1QueryClientStateResponse {
  return IbcCoreClientV1QueryClientStateResponseFromJSONTyped(json, false);
}

export function IbcCoreClientV1QueryClientStateResponseFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): IbcCoreClientV1QueryClientStateResponse {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    clientState: !exists(json, "client_state")
      ? undefined
      : ClientStateAssociatedWithTheRequestIdentifierFromJSON(
          json["client_state"],
        ),
    proof: !exists(json, "proof") ? undefined : json["proof"],
    proofHeight: !exists(json, "proof_height")
      ? undefined
      : HeightAtWhichTheProofWasRetrievedFromJSON(json["proof_height"]),
  };
}

export function IbcCoreClientV1QueryClientStateResponseToJSON(
  value?: IbcCoreClientV1QueryClientStateResponse | null,
): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    client_state: ClientStateAssociatedWithTheRequestIdentifierToJSON(
      value.clientState,
    ),
    proof: value.proof,
    proof_height: HeightAtWhichTheProofWasRetrievedToJSON(value.proofHeight),
  };
}
