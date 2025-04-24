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
    scaleUnit?: string;
    valueDisplay?: string;
    level?: string;
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

  type deleteFileParams = {
    fileId: string;
  };

  type FilesDTO = {
    fileId?: string;
    name?: string;
    path?: string;
    type?: string;
  };

  type getAllPropertiesParams = {
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

  type getFileInfoParams = {
    fileId: string;
  };

  type getFileUrlParams = {
    fileId: string;
  };

  type PageableObject = {
    offset?: number;
    sort?: SortObject;
    paged?: boolean;
    pageNumber?: number;
    pageSize?: number;
    unpaged?: boolean;
  };

  type PagePropertyDTO = {
    totalPages?: number;
    totalElements?: number;
    size?: number;
    content?: PropertyDTO[];
    number?: number;
    sort?: SortObject;
    first?: boolean;
    last?: boolean;
    numberOfElements?: number;
    pageable?: PageableObject;
    empty?: boolean;
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
    statusIds?: string[];
    fileIds?: string[];
    propertyTypeId?: string;
    propertyTypeCode?: string;
    propertyTypeName?: string;
    amenityDTOs?: AmenityDTO[];
    propertyFilesDTOs?: PropertyFilesDTO[];
    propertyPriceNewest?: PropertyPriceHistoryDTO;
    propertyPriceHistoryDTOs?: PropertyPriceHistoryDTO[];
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
    scaleUnit?: string;
    creator?: string;
    dateCreated?: string;
    modifier?: string;
    dateModified?: string;
    isDeleted?: number;
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
}
