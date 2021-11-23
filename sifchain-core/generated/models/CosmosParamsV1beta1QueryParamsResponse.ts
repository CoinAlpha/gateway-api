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
  InlineResponse20026Param,
  InlineResponse20026ParamFromJSON,
  InlineResponse20026ParamFromJSONTyped,
  InlineResponse20026ParamToJSON,
} from "./";

/**
 * QueryParamsResponse is response type for the Query/Params RPC method.
 * @export
 * @interface CosmosParamsV1beta1QueryParamsResponse
 */
export interface CosmosParamsV1beta1QueryParamsResponse {
  /**
   *
   * @type {InlineResponse20026Param}
   * @memberof CosmosParamsV1beta1QueryParamsResponse
   */
  param?: InlineResponse20026Param;
}

export function CosmosParamsV1beta1QueryParamsResponseFromJSON(
  json: any,
): CosmosParamsV1beta1QueryParamsResponse {
  return CosmosParamsV1beta1QueryParamsResponseFromJSONTyped(json, false);
}

export function CosmosParamsV1beta1QueryParamsResponseFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): CosmosParamsV1beta1QueryParamsResponse {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    param: !exists(json, "param")
      ? undefined
      : InlineResponse20026ParamFromJSON(json["param"]),
  };
}

export function CosmosParamsV1beta1QueryParamsResponseToJSON(
  value?: CosmosParamsV1beta1QueryParamsResponse | null,
): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    param: InlineResponse20026ParamToJSON(value.param),
  };
}
