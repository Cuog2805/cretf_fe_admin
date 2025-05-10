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

  type deleteAppointmentParams = {
    id: string;
  };

  type deleteDepositContractParams = {
    templateId: string;
  };

  type deleteFileParams = {
    fileId: string;
  };

  type deletePropertyParams = {
    id: string;
  };

  type deleteUserParams = {
    userId: string;
  };

  type DepositContractDTO = {
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

  type PageableObject = {
    offset?: number;
    sort?: SortObject;
    pageSize?: number;
    pageNumber?: number;
    paged?: boolean;
    unpaged?: boolean;
  };

  type PageStatusDTO = {
    totalPages?: number;
    totalElements?: number;
    size?: number;
    content?: StatusDTO[];
    number?: number;
    sort?: SortObject;
    first?: boolean;
    last?: boolean;
    numberOfElements?: number;
    pageable?: PageableObject;
    empty?: boolean;
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
    propertyPriceNewest?: PropertyPriceHistoryDTO;
    propertyPriceHistoryDTOs?: PropertyPriceHistoryDTO[];
    depositDTO?: DepositDTO;
    type?: string;
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

  type ResponsePropertyDTO = {
    success: boolean;
    message?: string;
    data: PropertyDTO;
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
