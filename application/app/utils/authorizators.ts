export interface PermissionLike {
  action: string
  resource: string
}

export default class Authorizators {
  private static WILDCARD = '*'
  private static SUBRESOURCE_DELIMITER = '/'
  private static FIELD_DELIMITER = '.'

  /**
   * Check if request is authorized by has
   * @param request - Array of request permissions
   * @param has - Array of has permissions
   * @returns Array of request permissions that are not authorized by has
   */
  static check(request: PermissionLike[], has: PermissionLike[]): PermissionLike[] {
    return request.filter((req) => !has.some((h) => this.isAuthorized(req, h)))
  }

  /**
   * Check if request is authorized by has
   * @param req - Request permission
   * @param has - Has permission
   * @returns True if request is authorized by has, false otherwise
   */
  private static isAuthorized(req: PermissionLike, has: PermissionLike): boolean {
    return (
      this.isActionAuthorized(req.action, has.action) &&
      this.isResourceAuthorized(req.resource, has.resource)
    )
  }

  /**
   * Check if action is authorized
   * @param req - Request action
   * @param has - Has action
   * @returns True if action is authorized, false otherwise
   */
  private static isActionAuthorized(req: string, has: string): boolean {
    return has === this.WILDCARD || has === req
  }

  /**
   * Check if resource is authorized
   * @param req - Request resource
   * @param has - Has resource
   * @returns True if resource is authorized, false otherwise
   */
  private static isResourceAuthorized(req: string, has: string): boolean {
    if (has === this.WILDCARD || has === req) return true
    const reqParts = req.split(this.SUBRESOURCE_DELIMITER)
    const hasParts = has.split(this.SUBRESOURCE_DELIMITER)
    if (reqParts.length !== hasParts.length) return false
    return hasParts.every((hasPart, i) => this.isPartAuthorized(reqParts[i], hasPart))
  }

  /**
   * Check if part is authorized
   * @param reqPart - Request part
   * @param hasPart - Has part
   * @returns True if part is authorized, false otherwise
   */
  private static isPartAuthorized(reqPart: string, hasPart: string): boolean {
    if (hasPart === this.WILDCARD || hasPart === reqPart) return true
    /// if hasPart does not contain field delimiter and reqPart does not contain field delimiter, then can't match.
    if (!hasPart.includes(this.FIELD_DELIMITER) && !reqPart.includes(this.FIELD_DELIMITER)) {
      return false
    }
    const reqFields = reqPart.split(this.FIELD_DELIMITER)
    const hasFields = hasPart.split(this.FIELD_DELIMITER)
    if (reqFields.length !== hasFields.length) return false
    return hasFields.every((field, i) => field === this.WILDCARD || field === reqFields[i])
  }
}
