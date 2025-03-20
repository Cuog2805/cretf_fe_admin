declare namespace API {
  type getAllPropertiesParams = {
    propertyDTO: PropertyDTO;
  };

  type PropertyDTO = {
    propertyId?: string;
    code?: string;
    name?: string;
    addressSpecific?: string;
    buildIn?: string;
    locationId?: string;
    statusId?: string;
    propertyTypeId?: string;
    propertyTypeCode?: string;
    propertyTypeName?: string;
    creator?: string;
    dateCreated?: string;
    modifier?: string;
    dateModified?: string;
    isDeleted?: number;
  };
}
