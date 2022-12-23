"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorySortFieldsEnum = exports.SimpleTypeSortFieldsEnum = exports.SimpleSortOrderEnum = exports.SimpleResultStatusEnum = exports.SectionItemSystemEnum = exports.RangeValidateDirectivePolicy = exports.NotNullValueValidateDirectivePolicy = exports.MarkerEnum = exports.ListStyleEnum = exports.LengthValidateDirectivePolicy = exports.ImageTransformRotateAngleEnum = exports.ImageTransformQualityEnum = exports.ImageTransformOverlayPositionEnum = exports.ImageTransformOverlayModeEnum = exports.ImageTransformFormatEnum = exports.HasPermissionsDirectivePolicy = exports.ContentTypeEnum = exports.ContentSortFieldsEnum = exports.ContentElementAlignmentEnum = exports.ChangeLogModeEnum = void 0;
var ChangeLogModeEnum;
(function (ChangeLogModeEnum) {
    ChangeLogModeEnum["Api"] = "API";
    ChangeLogModeEnum["Panel"] = "PANEL";
})(ChangeLogModeEnum = exports.ChangeLogModeEnum || (exports.ChangeLogModeEnum = {}));
var ContentElementAlignmentEnum;
(function (ContentElementAlignmentEnum) {
    ContentElementAlignmentEnum["Center"] = "CENTER";
    ContentElementAlignmentEnum["Left"] = "LEFT";
    ContentElementAlignmentEnum["Right"] = "RIGHT";
})(ContentElementAlignmentEnum = exports.ContentElementAlignmentEnum || (exports.ContentElementAlignmentEnum = {}));
var ContentSortFieldsEnum;
(function (ContentSortFieldsEnum) {
    ContentSortFieldsEnum["CreationTime"] = "CREATION_TIME";
    ContentSortFieldsEnum["Id"] = "ID";
})(ContentSortFieldsEnum = exports.ContentSortFieldsEnum || (exports.ContentSortFieldsEnum = {}));
var ContentTypeEnum;
(function (ContentTypeEnum) {
    ContentTypeEnum["Author"] = "AUTHOR";
    ContentTypeEnum["Source"] = "SOURCE";
    ContentTypeEnum["Story"] = "STORY";
    ContentTypeEnum["Topic"] = "TOPIC";
})(ContentTypeEnum = exports.ContentTypeEnum || (exports.ContentTypeEnum = {}));
var HasPermissionsDirectivePolicy;
(function (HasPermissionsDirectivePolicy) {
    HasPermissionsDirectivePolicy["Resolver"] = "RESOLVER";
    HasPermissionsDirectivePolicy["Throw"] = "THROW";
})(HasPermissionsDirectivePolicy = exports.HasPermissionsDirectivePolicy || (exports.HasPermissionsDirectivePolicy = {}));
var ImageTransformFormatEnum;
(function (ImageTransformFormatEnum) {
    ImageTransformFormatEnum["Bmp"] = "BMP";
    ImageTransformFormatEnum["Jpeg"] = "JPEG";
    ImageTransformFormatEnum["Original"] = "ORIGINAL";
    ImageTransformFormatEnum["Png"] = "PNG";
    ImageTransformFormatEnum["Tiff"] = "TIFF";
    ImageTransformFormatEnum["Webp"] = "WEBP";
})(ImageTransformFormatEnum = exports.ImageTransformFormatEnum || (exports.ImageTransformFormatEnum = {}));
var ImageTransformOverlayModeEnum;
(function (ImageTransformOverlayModeEnum) {
    ImageTransformOverlayModeEnum["Add"] = "ADD";
    ImageTransformOverlayModeEnum["Atop"] = "ATOP";
    ImageTransformOverlayModeEnum["Bumpmap"] = "BUMPMAP";
    ImageTransformOverlayModeEnum["Copy"] = "COPY";
    ImageTransformOverlayModeEnum["CopyBlack"] = "COPY_BLACK";
    ImageTransformOverlayModeEnum["CopyBlue"] = "COPY_BLUE";
    ImageTransformOverlayModeEnum["CopyCyan"] = "COPY_CYAN";
    ImageTransformOverlayModeEnum["CopyGreen"] = "COPY_GREEN";
    ImageTransformOverlayModeEnum["CopyMagenta"] = "COPY_MAGENTA";
    ImageTransformOverlayModeEnum["CopyOpacity"] = "COPY_OPACITY";
    ImageTransformOverlayModeEnum["CopyRed"] = "COPY_RED";
    ImageTransformOverlayModeEnum["CopyYellow"] = "COPY_YELLOW";
    ImageTransformOverlayModeEnum["Difference"] = "DIFFERENCE";
    ImageTransformOverlayModeEnum["Divide"] = "DIVIDE";
    ImageTransformOverlayModeEnum["In"] = "IN";
    ImageTransformOverlayModeEnum["Minus"] = "MINUS";
    ImageTransformOverlayModeEnum["Multiply"] = "MULTIPLY";
    ImageTransformOverlayModeEnum["Out"] = "OUT";
    ImageTransformOverlayModeEnum["Over"] = "OVER";
    ImageTransformOverlayModeEnum["Plus"] = "PLUS";
    ImageTransformOverlayModeEnum["Substract"] = "SUBSTRACT";
    ImageTransformOverlayModeEnum["Xor"] = "XOR";
})(ImageTransformOverlayModeEnum = exports.ImageTransformOverlayModeEnum || (exports.ImageTransformOverlayModeEnum = {}));
var ImageTransformOverlayPositionEnum;
(function (ImageTransformOverlayPositionEnum) {
    ImageTransformOverlayPositionEnum["BottomCenter"] = "BOTTOM_CENTER";
    ImageTransformOverlayPositionEnum["BottomLeft"] = "BOTTOM_LEFT";
    ImageTransformOverlayPositionEnum["BottomRight"] = "BOTTOM_RIGHT";
    ImageTransformOverlayPositionEnum["CenterCenter"] = "CENTER_CENTER";
    ImageTransformOverlayPositionEnum["CenterLeft"] = "CENTER_LEFT";
    ImageTransformOverlayPositionEnum["CenterRight"] = "CENTER_RIGHT";
    ImageTransformOverlayPositionEnum["TopCenter"] = "TOP_CENTER";
    ImageTransformOverlayPositionEnum["TopLeft"] = "TOP_LEFT";
    ImageTransformOverlayPositionEnum["TopRight"] = "TOP_RIGHT";
})(ImageTransformOverlayPositionEnum = exports.ImageTransformOverlayPositionEnum || (exports.ImageTransformOverlayPositionEnum = {}));
var ImageTransformQualityEnum;
(function (ImageTransformQualityEnum) {
    ImageTransformQualityEnum["High"] = "HIGH";
    ImageTransformQualityEnum["Low"] = "LOW";
    ImageTransformQualityEnum["Medium"] = "MEDIUM";
    ImageTransformQualityEnum["VeryHigh"] = "VERY_HIGH";
})(ImageTransformQualityEnum = exports.ImageTransformQualityEnum || (exports.ImageTransformQualityEnum = {}));
var ImageTransformRotateAngleEnum;
(function (ImageTransformRotateAngleEnum) {
    ImageTransformRotateAngleEnum["Rotate_90"] = "ROTATE_90";
    ImageTransformRotateAngleEnum["Rotate_180"] = "ROTATE_180";
    ImageTransformRotateAngleEnum["Rotate_270"] = "ROTATE_270";
})(ImageTransformRotateAngleEnum = exports.ImageTransformRotateAngleEnum || (exports.ImageTransformRotateAngleEnum = {}));
var LengthValidateDirectivePolicy;
(function (LengthValidateDirectivePolicy) {
    LengthValidateDirectivePolicy["Resolver"] = "RESOLVER";
    LengthValidateDirectivePolicy["Throw"] = "THROW";
})(LengthValidateDirectivePolicy = exports.LengthValidateDirectivePolicy || (exports.LengthValidateDirectivePolicy = {}));
var ListStyleEnum;
(function (ListStyleEnum) {
    ListStyleEnum["Circle"] = "CIRCLE";
    ListStyleEnum["Disk"] = "DISK";
    ListStyleEnum["LowercaseLetters"] = "LOWERCASE_LETTERS";
    ListStyleEnum["LowercaseRoman"] = "LOWERCASE_ROMAN";
    ListStyleEnum["None"] = "NONE";
    ListStyleEnum["Numbers"] = "NUMBERS";
    ListStyleEnum["Square"] = "SQUARE";
    ListStyleEnum["UppercaseLetters"] = "UPPERCASE_LETTERS";
    ListStyleEnum["UppercaseRoman"] = "UPPERCASE_ROMAN";
})(ListStyleEnum = exports.ListStyleEnum || (exports.ListStyleEnum = {}));
var MarkerEnum;
(function (MarkerEnum) {
    MarkerEnum["WithoutPicture"] = "WITHOUT_PICTURE";
    MarkerEnum["WithPicture"] = "WITH_PICTURE";
})(MarkerEnum = exports.MarkerEnum || (exports.MarkerEnum = {}));
var NotNullValueValidateDirectivePolicy;
(function (NotNullValueValidateDirectivePolicy) {
    NotNullValueValidateDirectivePolicy["Resolver"] = "RESOLVER";
    NotNullValueValidateDirectivePolicy["Throw"] = "THROW";
})(NotNullValueValidateDirectivePolicy = exports.NotNullValueValidateDirectivePolicy || (exports.NotNullValueValidateDirectivePolicy = {}));
var RangeValidateDirectivePolicy;
(function (RangeValidateDirectivePolicy) {
    RangeValidateDirectivePolicy["Resolver"] = "RESOLVER";
    RangeValidateDirectivePolicy["Throw"] = "THROW";
})(RangeValidateDirectivePolicy = exports.RangeValidateDirectivePolicy || (exports.RangeValidateDirectivePolicy = {}));
var SectionItemSystemEnum;
(function (SectionItemSystemEnum) {
    SectionItemSystemEnum["Base"] = "BASE";
    SectionItemSystemEnum["Recommendation"] = "RECOMMENDATION";
})(SectionItemSystemEnum = exports.SectionItemSystemEnum || (exports.SectionItemSystemEnum = {}));
var SimpleResultStatusEnum;
(function (SimpleResultStatusEnum) {
    SimpleResultStatusEnum["Error"] = "ERROR";
    SimpleResultStatusEnum["Ok"] = "OK";
})(SimpleResultStatusEnum = exports.SimpleResultStatusEnum || (exports.SimpleResultStatusEnum = {}));
var SimpleSortOrderEnum;
(function (SimpleSortOrderEnum) {
    SimpleSortOrderEnum["Asc"] = "ASC";
    SimpleSortOrderEnum["Desc"] = "DESC";
})(SimpleSortOrderEnum = exports.SimpleSortOrderEnum || (exports.SimpleSortOrderEnum = {}));
var SimpleTypeSortFieldsEnum;
(function (SimpleTypeSortFieldsEnum) {
    SimpleTypeSortFieldsEnum["CreationTime"] = "CREATION_TIME";
    SimpleTypeSortFieldsEnum["Id"] = "ID";
    SimpleTypeSortFieldsEnum["ModificationTime"] = "MODIFICATION_TIME";
    SimpleTypeSortFieldsEnum["Name"] = "NAME";
    SimpleTypeSortFieldsEnum["NameSlug"] = "NAME_SLUG";
    SimpleTypeSortFieldsEnum["Score"] = "SCORE";
})(SimpleTypeSortFieldsEnum = exports.SimpleTypeSortFieldsEnum || (exports.SimpleTypeSortFieldsEnum = {}));
var StorySortFieldsEnum;
(function (StorySortFieldsEnum) {
    StorySortFieldsEnum["CreationTime"] = "CREATION_TIME";
    StorySortFieldsEnum["Id"] = "ID";
    StorySortFieldsEnum["ModificationTime"] = "MODIFICATION_TIME";
    StorySortFieldsEnum["OrdinalNumber"] = "ORDINAL_NUMBER";
    StorySortFieldsEnum["Score"] = "SCORE";
    StorySortFieldsEnum["Title"] = "TITLE";
    StorySortFieldsEnum["TitleSlug"] = "TITLE_SLUG";
})(StorySortFieldsEnum = exports.StorySortFieldsEnum || (exports.StorySortFieldsEnum = {}));
//# sourceMappingURL=websiteAPI.js.map