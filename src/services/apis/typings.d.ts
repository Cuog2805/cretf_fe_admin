declare namespace API {
  type AmenityDTO = {
    amenityId?: string;
    propertyAmenityId?: string;
    propertyId?: string;
    code?: string;
    name?: string;
    description?: string;
    amenityType?: string;
    amenityTypeName?: string;
    isGeneralInfo?: boolean;
    value?: number;
    scaleId?: string;
    scaleUnit?: string;
    valueDisplay?: string;
    level?: string;
    ordinal?: number;
    creator?: string;
    dateCreated?: string;
    modifier?: string;
    dateModified?: string;
    isDeleted?: number;
  };

  type AppointmentDTO = {
    appointmentId?: string;
    propertyId?: string;
    propertyAddress?: string;
    buyerId?: string;
    buyer?: string;
    sellerId?: string;
    seller?: string;
    agentId?: string;
    agent?: string;
    type?: string;
    date?: string;
    statusId?: string;
    note?: string;
    creator?: string;
    dateCreated?: string;
    modifier?: string;
    dateModified?: string;
    isDeleted?: number;
  };

  type ApprovalHistoryDTO = {
    approvalId?: string;
    propertyId?: string;
    statusId?: string;
    note?: string;
    approvalDate?: string;
    approver?: string;
  };

  type CategorySharedDTO = {
    categorySharedId?: string;
    code?: string;
    codeParent?: string;
    level?: number;
    categoryType?: string;
    name?: string;
    path?: string;
    component?: string;
    icon?: string;
    access?: string;
    creator?: string;
    dateCreated?: string;
    modifier?: string;
    dateModified?: string;
    isDeleted?: number;
  };

  type CoordinatesDTO = {
    coordinatesId?: string;
    propertyId?: string;
    type?: string;
    title?: string;
    latitude?: number;
    longitude?: number;
  };

  type DashBoardDTO = {
    dashBoardId?: string;
    type?: string;
    priceRangeCode?: string;
    priceRange?: string;
    priceRangeCount?: number;
    priceRangePie?: number;
    name?: string;
    depositContractDate?: string;
    depositContractCount?: number;
    propertyTypeName?: string;
    propertyCount?: number;
    priceAvarage?: number;
    totalViews?: number;
    totalDepositContractValue?: number;
    totalPropertyActive?: number;
  };

  type deleteAppointmentParams = {
    id: string;
  };

  type deleteDepositContractParams = {
    templateId: string;
  };

  type deleteFileParams = {
    fileId: string;
  };

  type deletePropertyCommentParams = {
    id: string;
  };

  type deletePropertyParams = {
    id: string;
  };

  type deleteUserParams = {
    userId: string;
  };

  type DepositContractDTO = {
    depositContractId?: string;
    templateId?: string;
    depositId?: string;
    propertyId?: string;
    fileId?: string;
    fileName?: string;
    seller?: string;
    buyer?: string;
    dateCreated?: string;
    dueDate?: string;
    downloadUrl?: string;
    statusId?: string;
    depositDTO?: DepositDTO;
  };

  type DepositDTO = {
    depositId?: string;
    propertyId?: string;
    value?: string;
    scaleUnit?: string;
    dueDate?: number;
    note?: string;
  };

  type FilesDTO = {
    fileId?: string;
    name?: string;
    path?: string;
    type?: string;
  };

  type getAllDepositContractParams = {
    /** Zero-based page index (0..N) */
    page?: number;
    /** The size of the page to be returned */
    size?: number;
    /** Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. */
    sort?: string[];
  };

  type getAllDepositsParams = {
    /** Zero-based page index (0..N) */
    page?: number;
    /** The size of the page to be returned */
    size?: number;
    /** Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. */
    sort?: string[];
  };

  type getAllPropertiesParams = {
    /** Zero-based page index (0..N) */
    page?: number;
    /** The size of the page to be returned */
    size?: number;
    /** Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. */
    sort?: string[];
  };

  type getAllPublicFacilityParams = {
    /** Zero-based page index (0..N) */
    page?: number;
    /** The size of the page to be returned */
    size?: number;
    /** Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. */
    sort?: string[];
  };

  type getAllRolesParams = {
    /** Zero-based page index (0..N) */
    page?: number;
    /** The size of the page to be returned */
    size?: number;
    /** Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. */
    sort?: string[];
  };

  type getAllScaleParams = {
    /** Zero-based page index (0..N) */
    page?: number;
    /** The size of the page to be returned */
    size?: number;
    /** Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. */
    sort?: string[];
  };

  type getAllStatusParams = {
    /** Zero-based page index (0..N) */
    page?: number;
    /** The size of the page to be returned */
    size?: number;
    /** Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. */
    sort?: string[];
  };

  type getAppointmentBySearchParams = {
    /** Zero-based page index (0..N) */
    page?: number;
    /** The size of the page to be returned */
    size?: number;
    /** Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. */
    sort?: string[];
  };

  type getDepositContractByIdParams = {
    id: string;
  };

  type getDepositsByIdParams = {
    id: string;
  };

  type getFavouritePropertiesParams = {
    /** Zero-based page index (0..N) */
    page?: number;
    /** The size of the page to be returned */
    size?: number;
    /** Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. */
    sort?: string[];
  };

  type getFileInfoParams = {
    fileId: string;
  };

  type getFileUrlParams = {
    fileId: string;
  };

  type getUserByIdParams = {
    userId: string;
  };

  type LocationDTO = {
    locationId?: string;
    parentCode?: string;
    code?: string;
    path?: string;
    level?: number;
    name?: string;
    fullname?: string;
    description?: string;
    creator?: string;
    dateCreated?: string;
    modifier?: string;
    dateModified?: string;
    isDeleted?: number;
  };

  type lockRoleParams = {
    id: string;
  };

  type lockUserParams = {
    userId: string;
  };

  type PageableObject = {
    offset?: number;
    sort?: SortObject;
    paged?: boolean;
    pageNumber?: number;
    pageSize?: number;
    unpaged?: boolean;
  };

  type PageStatusDTO = {
    totalElements?: number;
    totalPages?: number;
    size?: number;
    content?: StatusDTO[];
    number?: number;
    sort?: SortObject;
    numberOfElements?: number;
    pageable?: PageableObject;
    first?: boolean;
    last?: boolean;
    empty?: boolean;
  };

  type PropertyCommentDTO = {
    propertyCommentId?: string;
    propertyId?: string;
    parentCode?: string;
    code?: string;
    path?: string;
    level?: number;
    content?: string;
    creator?: string;
    dateCreated?: string;
    modifier?: string;
    dateModified?: string;
    isDeleted?: number;
  };

  type PropertyDTO = {
    propertyId?: string;
    code?: string;
    name?: string;
    addressSpecific?: string;
    buildIn?: string;
    locationId?: string;
    locationIds?: string[];
    statusIds?: string[];
    fileIds?: string[];
    propertyTypeId?: string;
    propertyTypeCode?: string;
    propertyTypeName?: string;
    agent?: string;
    amenityDTOs?: AmenityDTO[];
    propertyFilesDTOs?: PropertyFilesDTO[];
    priceNewest?: string;
    priceNewestValue?: number;
    priceNewestScale?: string;
    priceFrom?: number;
    priceTo?: number;
    propertyPriceNewest?: PropertyPriceHistoryDTO;
    propertyPriceHistoryDTOs?: PropertyPriceHistoryDTO[];
    approvalHistoryDTO?: ApprovalHistoryDTO;
    approvalHistoryDTOs?: ApprovalHistoryDTO[];
    depositDTO?: DepositDTO;
    coordinatesDTO?: CoordinatesDTO;
    publicFacilityDTOs?: PublicFacilityDTO[];
    type?: string;
    views?: number;
    usernameFav?: string;
    isInFavourite?: number;
    propertyCommentDTOs?: PropertyCommentDTO[];
    creator?: string;
    dateCreated?: string;
    modifier?: string;
    dateModified?: string;
    isDeleted?: number;
  };

  type PropertyFilesDTO = {
    propertyFilesId?: string;
    propertyId?: string;
    fileIds?: string[];
    category?: string;
  };

  type PropertyPriceHistoryDTO = {
    propertyPriceHistoryId?: string;
    propertyId?: string;
    value?: number;
    scaleId?: string;
    scaleUnit?: string;
    creator?: string;
    dateCreated?: string;
    modifier?: string;
    dateModified?: string;
    isDeleted?: number;
  };

  type PropertyTypeDTO = {
    propertyTypeId?: string;
    code?: string;
    name?: string;
    description?: string;
    creator?: string;
    dateCreated?: string;
    modifier?: string;
    dateModified?: string;
    isDeleted?: number;
  };

  type PublicFacilityDTO = {
    publicFacilityId?: string;
    locationId?: string;
    locationIds?: string[];
    name?: string;
    coordinatesDTO?: CoordinatesDTO;
    distance?: number;
    creator?: string;
    dateCreated?: string;
    modifier?: string;
    dateModified?: string;
    isDeleted?: number;
  };

  type ResponseAppointmentDTO = {
    success: boolean;
    message?: string;
    data: AppointmentDTO;
    total: number;
    throwException?: boolean;
  };

  type ResponseDepositContractDTO = {
    success: boolean;
    message?: string;
    data: DepositContractDTO;
    total: number;
    throwException?: boolean;
  };

  type ResponseDepositDTO = {
    success: boolean;
    message?: string;
    data: DepositDTO;
    total: number;
    throwException?: boolean;
  };

  type ResponseListAmenityDTO = {
    success: boolean;
    message?: string;
    data: AmenityDTO[];
    total: number;
    throwException?: boolean;
  };

  type ResponseListAppointmentDTO = {
    success: boolean;
    message?: string;
    data: AppointmentDTO[];
    total: number;
    throwException?: boolean;
  };

  type ResponseListDashBoardDTO = {
    success: boolean;
    message?: string;
    data: DashBoardDTO[];
    total: number;
    throwException?: boolean;
  };

  type ResponseListDepositContractDTO = {
    success: boolean;
    message?: string;
    data: DepositContractDTO[];
    total: number;
    throwException?: boolean;
  };

  type ResponseListDepositDTO = {
    success: boolean;
    message?: string;
    data: DepositDTO[];
    total: number;
    throwException?: boolean;
  };

  type ResponseListLocationDTO = {
    success: boolean;
    message?: string;
    data: LocationDTO[];
    total: number;
    throwException?: boolean;
  };

  type ResponseListPropertyDTO = {
    success: boolean;
    message?: string;
    data: PropertyDTO[];
    total: number;
    throwException?: boolean;
  };

  type ResponseListPropertyTypeDTO = {
    success: boolean;
    message?: string;
    data: PropertyTypeDTO[];
    total: number;
    throwException?: boolean;
  };

  type ResponseListPublicFacilityDTO = {
    success: boolean;
    message?: string;
    data: PublicFacilityDTO[];
    total: number;
    throwException?: boolean;
  };

  type ResponseListRoleDTO = {
    success: boolean;
    message?: string;
    data: RoleDTO[];
    total: number;
    throwException?: boolean;
  };

  type ResponseListScaleDTO = {
    success: boolean;
    message?: string;
    data: ScaleDTO[];
    total: number;
    throwException?: boolean;
  };

  type ResponseListUsersDTO = {
    success: boolean;
    message?: string;
    data: UsersDTO[];
    total: number;
    throwException?: boolean;
  };

  type ResponsePropertyCommentDTO = {
    success: boolean;
    message?: string;
    data: PropertyCommentDTO;
    total: number;
    throwException?: boolean;
  };

  type ResponsePropertyDTO = {
    success: boolean;
    message?: string;
    data: PropertyDTO;
    total: number;
    throwException?: boolean;
  };

  type ResponsePublicFacilityDTO = {
    success: boolean;
    message?: string;
    data: PublicFacilityDTO;
    total: number;
    throwException?: boolean;
  };

  type ResponseRoleDTO = {
    success: boolean;
    message?: string;
    data: RoleDTO;
    total: number;
    throwException?: boolean;
  };

  type ResponseString = {
    success: boolean;
    message?: string;
    data: string;
    total: number;
    throwException?: boolean;
  };

  type ResponseUsersDTO = {
    success: boolean;
    message?: string;
    data: UsersDTO;
    total: number;
    throwException?: boolean;
  };

  type ResponseVoid = {
    success: boolean;
    message?: string;
    data: Record<string, any>;
    total: number;
    throwException?: boolean;
  };

  type RoleDTO = {
    roleId?: string;
    name?: string;
    description?: string;
    creator?: string;
    dateCreated?: string;
    modifier?: string;
    dateModified?: string;
    isDeleted?: number;
  };

  type ScaleDTO = {
    scaleId?: string;
    code?: string;
    unit?: string;
    description?: string;
    type?: string;
    creator?: string;
    dateCreated?: string;
    modifier?: string;
    dateModified?: string;
    isDeleted?: number;
  };

  type searchDepositContractParams = {
    keyword: string;
  };

  type SortObject = {
    empty?: boolean;
    sorted?: boolean;
    unsorted?: boolean;
  };

  type StatusDTO = {
    statusId?: string;
    code?: string;
    name?: string;
    type?: string;
    color?: string;
    creator?: string;
    dateCreated?: string;
    modifier?: string;
    dateModified?: string;
    isDeleted?: number;
  };

  type unlockRoleParams = {
    id: string;
  };

  type unlockUserParams = {
    userId: string;
  };

  type UserDetailDTO = {
    userDetailId?: string;
    userId?: string;
    phone?: string;
    fullName?: string;
    gender?: string;
    avatar?: string;
    bio?: string;
    experience?: string;
    identificationNumber?: string;
  };

  type UsersDTO = {
    userId?: string;
    username?: string;
    email?: string;
    password?: string;
    newPassword?: string;
    roleId?: string;
    statusId?: string;
    locationId?: string;
    token?: string;
    userDetailDTO?: UserDetailDTO;
    creator?: string;
    dateCreated?: string;
    modifier?: string;
    dateModified?: string;
    isDeleted?: number;
  };
}
