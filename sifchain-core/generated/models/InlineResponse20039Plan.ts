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
  IBCEnabledChainsCanOptInToIncludingTheUpgradedClientStateInItsUpgradePlan,
  IBCEnabledChainsCanOptInToIncludingTheUpgradedClientStateInItsUpgradePlanFromJSON,
  IBCEnabledChainsCanOptInToIncludingTheUpgradedClientStateInItsUpgradePlanFromJSONTyped,
  IBCEnabledChainsCanOptInToIncludingTheUpgradedClientStateInItsUpgradePlanToJSON,
} from "./";

/**
 * plan is the current upgrade plan.
 * @export
 * @interface InlineResponse20039Plan
 */
export interface InlineResponse20039Plan {
  /**
   * Sets the name for the upgrade. This name will be used by the upgraded
   * version of the software to apply any special "on-upgrade" commands during
   * the first BeginBlock method after the upgrade is applied. It is also used
   * to detect whether a software version can handle a given upgrade. If no
   * upgrade handler with this name has been set in the software, it will be
   * assumed that the software is out-of-date when the upgrade Time or Height is
   * reached and the software will exit.
   * @type {string}
   * @memberof InlineResponse20039Plan
   */
  name?: string;
  /**
   * The time after which the upgrade must be performed.
   * Leave set to its zero value to use a pre-defined Height instead.
   * @type {Date}
   * @memberof InlineResponse20039Plan
   */
  time?: Date;
  /**
   * The height at which the upgrade must be performed.
   * Only used if Time is not set.
   * @type {string}
   * @memberof InlineResponse20039Plan
   */
  height?: string;
  /**
   *
   * @type {string}
   * @memberof InlineResponse20039Plan
   */
  info?: string;
  /**
   *
   * @type {IBCEnabledChainsCanOptInToIncludingTheUpgradedClientStateInItsUpgradePlan}
   * @memberof InlineResponse20039Plan
   */
  upgradedClientState?: IBCEnabledChainsCanOptInToIncludingTheUpgradedClientStateInItsUpgradePlan;
}

export function InlineResponse20039PlanFromJSON(
  json: any,
): InlineResponse20039Plan {
  return InlineResponse20039PlanFromJSONTyped(json, false);
}

export function InlineResponse20039PlanFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): InlineResponse20039Plan {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    name: !exists(json, "name") ? undefined : json["name"],
    time: !exists(json, "time") ? undefined : new Date(json["time"]),
    height: !exists(json, "height") ? undefined : json["height"],
    info: !exists(json, "info") ? undefined : json["info"],
    upgradedClientState: !exists(json, "upgraded_client_state")
      ? undefined
      : IBCEnabledChainsCanOptInToIncludingTheUpgradedClientStateInItsUpgradePlanFromJSON(
          json["upgraded_client_state"],
        ),
  };
}

export function InlineResponse20039PlanToJSON(
  value?: InlineResponse20039Plan | null,
): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    name: value.name,
    time: value.time === undefined ? undefined : value.time.toISOString(),
    height: value.height,
    info: value.info,
    upgraded_client_state: IBCEnabledChainsCanOptInToIncludingTheUpgradedClientStateInItsUpgradePlanToJSON(
      value.upgradedClientState,
    ),
  };
}
