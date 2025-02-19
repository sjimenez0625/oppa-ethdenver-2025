import { CrudRequest, CrudRequestOptions } from '@dataui/crud';
import { ParsedRequestParams } from '@dataui/crud-request';

import { UserAccessTokenClaims } from '../../auth/dtos/auth-token-output.dto';

export class RequestContext implements CrudRequest {
  parsed: ParsedRequestParams<object>;
  options: CrudRequestOptions;
  auth?: object | undefined;
  public requestID: string | undefined;

  public url: string;

  public ip: string | undefined;

  // TODO : Discuss with team if this import is acceptable or if we should move UserAccessTokenClaims to shared.
  public user: UserAccessTokenClaims | null;
}
