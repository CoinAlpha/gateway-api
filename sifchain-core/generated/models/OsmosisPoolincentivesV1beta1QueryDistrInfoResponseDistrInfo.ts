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
  OsmosisPoolincentivesV1beta1DistrInfoRecords,
  OsmosisPoolincentivesV1beta1DistrInfoRecordsFromJSON,
  OsmosisPoolincentivesV1beta1DistrInfoRecordsFromJSONTyped,
  OsmosisPoolincentivesV1beta1DistrInfoRecordsToJSON,
} from "./";

/**
 *
 * @export
 * @interface OsmosisPoolincentivesV1beta1QueryDistrInfoResponseDistrInfo
 */
export interface OsmosisPoolincentivesV1beta1QueryDistrInfoResponseDistrInfo {
  /**
   *
   * @type {string}
   * @memberof OsmosisPoolincentivesV1beta1QueryDistrInfoResponseDistrInfo
   */
  totalWeight?: string;
  /**
   *
   * @type {Array<OsmosisPoolincentivesV1beta1DistrInfoRecords>}
   * @memberof OsmosisPoolincentivesV1beta1QueryDistrInfoResponseDistrInfo
   */
  records?: Array<OsmosisPoolincentivesV1beta1DistrInfoRecords>;
}

export function OsmosisPoolincentivesV1beta1QueryDistrInfoResponseDistrInfoFromJSON(
  json: any,
): OsmosisPoolincentivesV1beta1QueryDistrInfoResponseDistrInfo {
  return OsmosisPoolincentivesV1beta1QueryDistrInfoResponseDistrInfoFromJSONTyped(
    json,
    false,
  );
}

export function OsmosisPoolincentivesV1beta1QueryDistrInfoResponseDistrInfoFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): OsmosisPoolincentivesV1beta1QueryDistrInfoResponseDistrInfo {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    totalWeight: !exists(json, "total_weight")
      ? undefined
      : json["total_weight"],
    records: !exists(json, "records")
      ? undefined
      : (json["records"] as Array<any>).map(
          OsmosisPoolincentivesV1beta1DistrInfoRecordsFromJSON,
        ),
  };
}

export function OsmosisPoolincentivesV1beta1QueryDistrInfoResponseDistrInfoToJSON(
  value?: OsmosisPoolincentivesV1beta1QueryDistrInfoResponseDistrInfo | null,
): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    total_weight: value.totalWeight,
    records:
      value.records === undefined
        ? undefined
        : (value.records as Array<any>).map(
            OsmosisPoolincentivesV1beta1DistrInfoRecordsToJSON,
          ),
  };
}
