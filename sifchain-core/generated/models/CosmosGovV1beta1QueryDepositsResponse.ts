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
  InlineResponse20021Deposits,
  InlineResponse20021DepositsFromJSON,
  InlineResponse20021DepositsFromJSONTyped,
  InlineResponse20021DepositsToJSON,
  InlineResponse2002Pagination,
  InlineResponse2002PaginationFromJSON,
  InlineResponse2002PaginationFromJSONTyped,
  InlineResponse2002PaginationToJSON,
} from "./";

/**
 * QueryDepositsResponse is the response type for the Query/Deposits RPC method.
 * @export
 * @interface CosmosGovV1beta1QueryDepositsResponse
 */
export interface CosmosGovV1beta1QueryDepositsResponse {
  /**
   *
   * @type {Array<InlineResponse20021Deposits>}
   * @memberof CosmosGovV1beta1QueryDepositsResponse
   */
  deposits?: Array<InlineResponse20021Deposits>;
  /**
   *
   * @type {InlineResponse2002Pagination}
   * @memberof CosmosGovV1beta1QueryDepositsResponse
   */
  pagination?: InlineResponse2002Pagination;
}

export function CosmosGovV1beta1QueryDepositsResponseFromJSON(
  json: any,
): CosmosGovV1beta1QueryDepositsResponse {
  return CosmosGovV1beta1QueryDepositsResponseFromJSONTyped(json, false);
}

export function CosmosGovV1beta1QueryDepositsResponseFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): CosmosGovV1beta1QueryDepositsResponse {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    deposits: !exists(json, "deposits")
      ? undefined
      : (json["deposits"] as Array<any>).map(
          InlineResponse20021DepositsFromJSON,
        ),
    pagination: !exists(json, "pagination")
      ? undefined
      : InlineResponse2002PaginationFromJSON(json["pagination"]),
  };
}

export function CosmosGovV1beta1QueryDepositsResponseToJSON(
  value?: CosmosGovV1beta1QueryDepositsResponse | null,
): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    deposits:
      value.deposits === undefined
        ? undefined
        : (value.deposits as Array<any>).map(InlineResponse20021DepositsToJSON),
    pagination: InlineResponse2002PaginationToJSON(value.pagination),
  };
}
