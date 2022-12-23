export declare type Maybe<T> = T | null;
export declare type Exact<T extends {
    [key: string]: unknown;
}> = {
    [K in keyof T]: T[K];
};
export declare type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export declare type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
export declare type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    BigInt: any;
    ContentCursor: any;
    DateTime: any;
    Domain: any;
    ImageURL: any;
    JSONObject: any;
    URL: any;
    UUID: any;
};
export declare type Archive = {
    __typename?: "Archive";
    years: Array<ArchiveYear>;
};
export declare type ArchiveDay = {
    __typename?: "ArchiveDay";
    count: Scalars["Int"];
    day: Scalars["Int"];
};
export declare type ArchiveMonth = {
    __typename?: "ArchiveMonth";
    days: Array<ArchiveDay>;
    month: Scalars["Int"];
};
export declare type ArchiveYear = {
    __typename?: "ArchiveYear";
    months: Array<ArchiveMonth>;
    year: Scalars["Int"];
};
export declare type Author = {
    __typename?: "Author";
    description?: Maybe<ContentDescription>;
    extensions: Array<Extension>;
    id: Scalars["UUID"];
    image?: Maybe<MainImageReference>;
    images: Array<MainImageReference>;
    name: Scalars["String"];
    publicationPoint?: Maybe<PublicationPoint>;
    publicationPoints: Array<PublicationPoint>;
    socialProfiles: Array<AuthorSocialProfile>;
    system: SystemData;
    tagline?: Maybe<Scalars["String"]>;
    topics: Array<AuthorTopicReference>;
};
export declare type AuthorExtensionsArgs = {
    type?: Maybe<Scalars["String"]>;
};
export declare type AuthorImagesArgs = {
    role?: Maybe<Scalars["String"]>;
};
export declare type AuthorSocialProfilesArgs = {
    role?: Maybe<Scalars["String"]>;
};
export declare type AuthorTopicsArgs = {
    kind?: Maybe<Scalars["String"]>;
};
export declare type AuthorEdge = {
    __typename?: "AuthorEdge";
    cursor?: Maybe<Scalars["ContentCursor"]>;
    node: Author;
};
export declare type AuthorFilterInput = {
    creationTime?: Maybe<DateTimeFilterInput>;
    id?: Maybe<UuidFilterInput>;
    marker?: Maybe<MarkerFilterInput>;
};
export declare type AuthorSearchResult = {
    __typename?: "AuthorSearchResult";
    edges: Array<AuthorEdge>;
    pageInfo?: Maybe<PageInfo>;
    total?: Maybe<Scalars["Int"]>;
};
export declare type AuthorSocialProfile = {
    __typename?: "AuthorSocialProfile";
    role: Term;
    url: Scalars["URL"];
};
export declare type AuthorSortByInput = {
    field: SimpleTypeSortFieldsEnum;
    order?: Maybe<SimpleSortOrderEnum>;
};
export declare type AuthorTopicReference = {
    __typename?: "AuthorTopicReference";
    topic: Topic;
};
export declare type AuthorsSettingsInput = {
    path?: Maybe<Scalars["String"]>;
};
export declare type Breadcrumb = {
    __typename?: "Breadcrumb";
    name: Scalars["String"];
    slug?: Maybe<Scalars["String"]>;
    url?: Maybe<Scalars["URL"]>;
};
export declare type CategoryReference = {
    __typename?: "CategoryReference";
    data?: Maybe<Topic>;
    id: Scalars["UUID"];
};
export declare type ChangeLog = {
    __typename?: "ChangeLog";
    creationTime: Scalars["DateTime"];
    data?: Maybe<Scalars["JSONObject"]>;
    mode?: Maybe<ChangeLogModeEnum>;
    moduleName: Scalars["String"];
    node: Node;
    user?: Maybe<RingUser>;
};
export declare type ChangeLogCreationTimeArgs = {
    format?: Maybe<Scalars["String"]>;
    tz?: Maybe<Scalars["String"]>;
};
export declare enum ChangeLogModeEnum {
    Api = "API",
    Panel = "PANEL"
}
export declare type CloneVariantInput = {
    configurationTemplateAlias?: Maybe<Scalars["String"]>;
    configurationTemplateVersion?: Maybe<Scalars["String"]>;
    name: Scalars["String"];
    sourceVariantID: Scalars["ID"];
};
export declare type Collection = {
    __typename?: "Collection";
    id: Scalars["UUID"];
    name: Scalars["String"];
    recommendations: Array<CollectionRecommendationReference>;
};
export declare type CollectionRecommendationReference = {
    __typename?: "CollectionRecommendationReference";
    recommendation: Recommendation;
};
export declare type ConfigurationTemplate = {
    __typename?: "ConfigurationTemplate";
    aliases: Array<Maybe<ConfigurationTemplateAlias>>;
    name: Scalars["String"];
    versions: Array<Maybe<ConfigurationTemplateVersion>>;
};
export declare type ConfigurationTemplateVersionsArgs = {
    ids?: Maybe<Array<Scalars["ID"]>>;
};
export declare type ConfigurationTemplateAlias = {
    __typename?: "ConfigurationTemplateAlias";
    configurationTemplateVersion: ConfigurationTemplateVersion;
    name: Scalars["String"];
    variants: Array<Maybe<Variant>>;
};
export declare type ConfigurationTemplateAliasMutationResult = SimpleResult & {
    __typename?: "ConfigurationTemplateAliasMutationResult";
    affectedId?: Maybe<Scalars["ID"]>;
    data?: Maybe<ConfigurationTemplateAlias>;
    errors?: Maybe<Array<ResultError>>;
    status: SimpleResultStatusEnum;
};
export declare type ConfigurationTemplateVersion = {
    __typename?: "ConfigurationTemplateVersion";
    configurationTemplateReference: ConfigurationTemplate;
    id: Scalars["ID"];
    structure: Scalars["JSONObject"];
    variants: Array<Maybe<Variant>>;
};
export declare type ConfigurationTemplateVersionMutationResult = SimpleResult & {
    __typename?: "ConfigurationTemplateVersionMutationResult";
    affectedId?: Maybe<Scalars["ID"]>;
    data?: Maybe<ConfigurationTemplateVersion>;
    errors?: Maybe<Array<ResultError>>;
    status: SimpleResultStatusEnum;
};
export declare type Content = {
    __typename?: "Content";
    blocks: Array<ContentBlock>;
    role: Term;
};
export declare type ContentBlock = {
    type: Scalars["String"];
};
export declare type ContentDescription = {
    __typename?: "ContentDescription";
    content: Array<Content>;
    image?: Maybe<MainImageReference>;
    images: Array<ImageReference>;
};
export declare type ContentDescriptionContentArgs = {
    role?: Maybe<Scalars["String"]>;
};
export declare type ContentDescriptionImagesArgs = {
    role?: Maybe<Scalars["String"]>;
};
export declare type ContentEdge = {
    __typename?: "ContentEdge";
    cursor?: Maybe<Scalars["ContentCursor"]>;
    node: PublishedContent;
};
export declare enum ContentElementAlignmentEnum {
    Center = "CENTER",
    Left = "LEFT",
    Right = "RIGHT"
}
export declare type ContentFilterInput = {
    creationTime?: Maybe<DateTimeFilterInput>;
    id?: Maybe<UuidFilterInput>;
    marker?: Maybe<MarkerFilterInput>;
    type?: Maybe<ContentTypeFilterInput>;
};
export declare type ContentSearchResult = {
    __typename?: "ContentSearchResult";
    edges: Array<ContentEdge>;
    pageInfo?: Maybe<PageInfo>;
    total?: Maybe<Scalars["Int"]>;
};
export declare type ContentSortByInput = {
    field: ContentSortFieldsEnum;
    order?: Maybe<SimpleSortOrderEnum>;
};
export declare enum ContentSortFieldsEnum {
    CreationTime = "CREATION_TIME",
    Id = "ID"
}
export declare enum ContentTypeEnum {
    Author = "AUTHOR",
    Source = "SOURCE",
    Story = "STORY",
    Topic = "TOPIC"
}
export declare type ContentTypeFilterInput = {
    in?: Maybe<Array<ContentTypeEnum>>;
    notIn?: Maybe<Array<ContentTypeEnum>>;
};
export declare type CreateConfigurationTemplateAliasInput = {
    configurationTemplateName: Scalars["String"];
    configurationTemplateVersion: Scalars["String"];
    name: Scalars["String"];
};
export declare type CreateConfigurationTemplateVersionInput = {
    configurationTemplateName: Scalars["String"];
    id: Scalars["ID"];
    structure: Scalars["JSONObject"];
};
export declare type CreateCustomActionInput = {
    action: Scalars["String"];
    priority?: Maybe<Scalars["Int"]>;
    regexp: Scalars["String"];
};
export declare type CreateNodeInput = {
    additionalProperties?: Maybe<NodeAdditionalPropertiesInput>;
    categoryId: Scalars["UUID"];
    name: Scalars["String"];
    parentId: Scalars["ID"];
};
export declare type CreateVariantInput = {
    configurationTemplateAlias?: Maybe<Scalars["String"]>;
    configurationTemplateName?: Maybe<Scalars["String"]>;
    configurationTemplateVersion?: Maybe<Scalars["String"]>;
    name: Scalars["String"];
};
export declare type CustomAction = {
    __typename?: "CustomAction";
    action: Scalars["String"];
    id: Scalars["UUID"];
    priority?: Maybe<Scalars["Int"]>;
    regexp: Scalars["String"];
};
export declare type CustomActionMutationResult = SimpleResult & {
    __typename?: "CustomActionMutationResult";
    affectedId: Scalars["ID"];
    data?: Maybe<CustomAction>;
    errors?: Maybe<Array<ResultError>>;
    status: SimpleResultStatusEnum;
};
export declare type DateTimeFilterInput = {
    gt?: Maybe<Scalars["DateTime"]>;
    lt?: Maybe<Scalars["DateTime"]>;
};
export declare type DeleteConfigurationTemplateAliasResult = SimpleResult & {
    __typename?: "DeleteConfigurationTemplateAliasResult";
    affectedId?: Maybe<Scalars["ID"]>;
    errors?: Maybe<Array<ResultError>>;
    status: SimpleResultStatusEnum;
};
export declare type DeleteConfigurationTemplateVersionResult = SimpleResult & {
    __typename?: "DeleteConfigurationTemplateVersionResult";
    affectedId?: Maybe<Scalars["ID"]>;
    errors?: Maybe<Array<ResultError>>;
    status: SimpleResultStatusEnum;
};
export declare type DeleteCustomActionResult = SimpleResult & {
    __typename?: "DeleteCustomActionResult";
    affectedId: Scalars["ID"];
    errors?: Maybe<Array<ResultError>>;
    status: SimpleResultStatusEnum;
};
export declare type DeleteNodeResult = SimpleResultUuid & {
    __typename?: "DeleteNodeResult";
    affectedId: Scalars["UUID"];
    errors?: Maybe<Array<ResultError>>;
    status: SimpleResultStatusEnum;
};
export declare type DeleteVariantResult = SimpleResult & {
    __typename?: "DeleteVariantResult";
    affectedId: Scalars["ID"];
    errors?: Maybe<Array<ResultError>>;
    status: SimpleResultStatusEnum;
};
export declare type Embed = {
    __typename?: "Embed";
    html: Scalars["String"];
    id: Scalars["ID"];
    image?: Maybe<MainImageReference>;
    kind: Term;
    params?: Maybe<Scalars["JSONObject"]>;
    title: Scalars["String"];
    url: Scalars["URL"];
};
export declare type EmbedBlock = ContentBlock & {
    __typename?: "EmbedBlock";
    alignment: ContentElementAlignmentEnum;
    embed?: Maybe<Embed>;
    title?: Maybe<Scalars["String"]>;
    type: Scalars["String"];
};
export declare type Emotion = {
    __typename?: "Emotion";
    code: Scalars["String"];
    value: Scalars["Float"];
};
export declare type EventDates = {
    __typename?: "EventDates";
    endTime?: Maybe<Scalars["DateTime"]>;
    startTime?: Maybe<Scalars["DateTime"]>;
};
export declare type EventDatesEndTimeArgs = {
    format?: Maybe<Scalars["String"]>;
    tz?: Maybe<Scalars["String"]>;
};
export declare type EventDatesStartTimeArgs = {
    format?: Maybe<Scalars["String"]>;
    tz?: Maybe<Scalars["String"]>;
};
export declare type ExpressionFilterInput = {
    eq?: Maybe<Scalars["String"]>;
    startsWith?: Maybe<Scalars["String"]>;
};
export declare type Extension = {
    __typename?: "Extension";
    data: Scalars["JSONObject"];
    type: Scalars["String"];
};
export declare type GroupBlock = ContentBlock & {
    __typename?: "GroupBlock";
    alignment: ContentElementAlignmentEnum;
    name: Scalars["String"];
    type: Scalars["String"];
};
export declare enum HasPermissionsDirectivePolicy {
    Resolver = "RESOLVER",
    Throw = "THROW"
}
export declare type Headers = {
    __typename?: "Headers";
    location?: Maybe<Scalars["URL"]>;
};
export declare type HeadingBlock = ContentBlock & {
    __typename?: "HeadingBlock";
    level?: Maybe<Scalars["Int"]>;
    text: Scalars["String"];
    type: Scalars["String"];
};
export declare type Image = {
    __typename?: "Image";
    authors: Array<ImageAuthorReference>;
    date?: Maybe<ImageDates>;
    description?: Maybe<Scalars["String"]>;
    flags: Array<Term>;
    height: Scalars["Int"];
    id: Scalars["UUID"];
    license: ImageLicenseReference;
    name: Scalars["String"];
    size: Scalars["Int"];
    sources: Array<ImageSourceReference>;
    title: Scalars["String"];
    topics: Array<ImageTopicReference>;
    url?: Maybe<Scalars["ImageURL"]>;
    width: Scalars["Int"];
};
export declare type ImageTopicsArgs = {
    kind?: Maybe<Scalars["String"]>;
};
export declare type ImageUrlArgs = {
    transforms?: Maybe<Array<ImageTransformInput>>;
};
export declare type ImageAuthorReference = {
    __typename?: "ImageAuthorReference";
    author: Author;
};
export declare type ImageBlock = ContentBlock & {
    __typename?: "ImageBlock";
    alignment: ContentElementAlignmentEnum;
    alt?: Maybe<Scalars["String"]>;
    crop?: Maybe<ImageCrop>;
    image: Image;
    link?: Maybe<LinkObject>;
    roles: Array<Scalars["String"]>;
    title?: Maybe<Scalars["String"]>;
    type: Scalars["String"];
    url: Scalars["ImageURL"];
};
export declare type ImageBlockUrlArgs = {
    transforms?: Maybe<Array<ImageTransformInput>>;
};
export declare type ImageCrop = {
    __typename?: "ImageCrop";
    height?: Maybe<Scalars["Int"]>;
    width?: Maybe<Scalars["Int"]>;
    x?: Maybe<Scalars["Int"]>;
    y?: Maybe<Scalars["Int"]>;
};
export declare type ImageDates = {
    __typename?: "ImageDates";
    expirationTime?: Maybe<Scalars["DateTime"]>;
};
export declare type ImageDatesExpirationTimeArgs = {
    format?: Maybe<Scalars["String"]>;
    tz?: Maybe<Scalars["String"]>;
};
export declare type ImageLicenseReference = {
    __typename?: "ImageLicenseReference";
    license: License;
    note?: Maybe<Scalars["String"]>;
};
export declare type ImageReference = {
    __typename?: "ImageReference";
    caption?: Maybe<Scalars["String"]>;
    crop?: Maybe<ImageCrop>;
    image: Image;
    role?: Maybe<Term>;
    url: Scalars["ImageURL"];
};
export declare type ImageReferenceUrlArgs = {
    transforms?: Maybe<Array<ImageTransformInput>>;
};
export declare type ImageSourceReference = {
    __typename?: "ImageSourceReference";
    source: Source;
};
export declare type ImageTopicReference = {
    __typename?: "ImageTopicReference";
    topic: Topic;
};
export declare type ImageTransformAnimationInput = {
    enabled: Scalars["Boolean"];
};
export declare type ImageTransformAutoOrientationInput = {
    enabled: Scalars["Boolean"];
};
export declare type ImageTransformBackgroundInput = {
    alpha: Scalars["Int"];
    blue: Scalars["Int"];
    green: Scalars["Int"];
    red: Scalars["Int"];
};
export declare type ImageTransformBlurInput = {
    strength: Scalars["Int"];
};
export declare type ImageTransformCropInput = {
    height: Scalars["Int"];
    width: Scalars["Int"];
    x: Scalars["Int"];
    y: Scalars["Int"];
};
export declare enum ImageTransformFormatEnum {
    Bmp = "BMP",
    Jpeg = "JPEG",
    Original = "ORIGINAL",
    Png = "PNG",
    Tiff = "TIFF",
    Webp = "WEBP"
}
export declare type ImageTransformFormatInput = {
    format: ImageTransformFormatEnum;
};
export declare type ImageTransformGrayscaleInput = {
    enabled: Scalars["Boolean"];
};
export declare type ImageTransformInput = {
    animation?: Maybe<ImageTransformAnimationInput>;
    autoOrientation?: Maybe<ImageTransformAutoOrientationInput>;
    background?: Maybe<ImageTransformBackgroundInput>;
    blur?: Maybe<ImageTransformBlurInput>;
    crop?: Maybe<ImageTransformCropInput>;
    format?: Maybe<ImageTransformFormatInput>;
    grayscale?: Maybe<ImageTransformGrayscaleInput>;
    name?: Maybe<ImageTransformNameInput>;
    overlay?: Maybe<ImageTransformOverlayInput>;
    quality?: Maybe<ImageTransformQualityInput>;
    resize?: Maybe<ImageTransformResizeInput>;
    resizeCropAuto?: Maybe<ImageTransformResizeCropAutoInput>;
    rotate?: Maybe<ImageTransformRotateInput>;
};
export declare type ImageTransformNameInput = {
    name: Scalars["String"];
};
export declare type ImageTransformOverlayInput = {
    mode: ImageTransformOverlayModeEnum;
    position: ImageTransformOverlayPositionEnum;
    reverse: Scalars["Boolean"];
    url: Scalars["URL"];
};
export declare enum ImageTransformOverlayModeEnum {
    Add = "ADD",
    Atop = "ATOP",
    Bumpmap = "BUMPMAP",
    Copy = "COPY",
    CopyBlack = "COPY_BLACK",
    CopyBlue = "COPY_BLUE",
    CopyCyan = "COPY_CYAN",
    CopyGreen = "COPY_GREEN",
    CopyMagenta = "COPY_MAGENTA",
    CopyOpacity = "COPY_OPACITY",
    CopyRed = "COPY_RED",
    CopyYellow = "COPY_YELLOW",
    Difference = "DIFFERENCE",
    Divide = "DIVIDE",
    In = "IN",
    Minus = "MINUS",
    Multiply = "MULTIPLY",
    Out = "OUT",
    Over = "OVER",
    Plus = "PLUS",
    Substract = "SUBSTRACT",
    Xor = "XOR"
}
export declare enum ImageTransformOverlayPositionEnum {
    BottomCenter = "BOTTOM_CENTER",
    BottomLeft = "BOTTOM_LEFT",
    BottomRight = "BOTTOM_RIGHT",
    CenterCenter = "CENTER_CENTER",
    CenterLeft = "CENTER_LEFT",
    CenterRight = "CENTER_RIGHT",
    TopCenter = "TOP_CENTER",
    TopLeft = "TOP_LEFT",
    TopRight = "TOP_RIGHT"
}
export declare enum ImageTransformQualityEnum {
    High = "HIGH",
    Low = "LOW",
    Medium = "MEDIUM",
    VeryHigh = "VERY_HIGH"
}
export declare type ImageTransformQualityInput = {
    quality: ImageTransformQualityEnum;
};
export declare type ImageTransformResizeCropAutoInput = {
    height: Scalars["Int"];
    width: Scalars["Int"];
};
export declare type ImageTransformResizeInput = {
    height: Scalars["Int"];
    scaleDown: Scalars["Boolean"];
    scaleUp: Scalars["Boolean"];
    width: Scalars["Int"];
};
export declare enum ImageTransformRotateAngleEnum {
    Rotate_90 = "ROTATE_90",
    Rotate_180 = "ROTATE_180",
    Rotate_270 = "ROTATE_270"
}
export declare type ImageTransformRotateInput = {
    angle: ImageTransformRotateAngleEnum;
};
export declare type LegacyBlock = ContentBlock & {
    __typename?: "LegacyBlock";
    data?: Maybe<Scalars["JSONObject"]>;
    type: Scalars["String"];
};
export declare enum LengthValidateDirectivePolicy {
    Resolver = "RESOLVER",
    Throw = "THROW"
}
export declare type License = {
    __typename?: "License";
    id: Scalars["UUID"];
    name: Scalars["String"];
};
export declare type LinkObject = {
    __typename?: "LinkObject";
    url: Scalars["URL"];
};
export declare enum ListStyleEnum {
    Circle = "CIRCLE",
    Disk = "DISK",
    LowercaseLetters = "LOWERCASE_LETTERS",
    LowercaseRoman = "LOWERCASE_ROMAN",
    None = "NONE",
    Numbers = "NUMBERS",
    Square = "SQUARE",
    UppercaseLetters = "UPPERCASE_LETTERS",
    UppercaseRoman = "UPPERCASE_ROMAN"
}
export declare type MainImageReference = {
    __typename?: "MainImageReference";
    caption?: Maybe<Scalars["String"]>;
    crop?: Maybe<ImageCrop>;
    image: Image;
    role?: Maybe<Term>;
    url: Scalars["ImageURL"];
};
export declare type MainImageReferenceUrlArgs = {
    transforms?: Maybe<Array<ImageTransformInput>>;
};
export declare enum MarkerEnum {
    WithoutPicture = "WITHOUT_PICTURE",
    WithPicture = "WITH_PICTURE"
}
export declare type MarkerFilterInput = {
    in?: Maybe<Array<MarkerEnum>>;
};
export declare type ModuleConfiguration = {
    __typename?: "ModuleConfiguration";
    codeName: Scalars["String"];
    data: Scalars["JSONObject"];
    name: Scalars["String"];
};
export declare type Mutation = {
    __typename?: "Mutation";
    cloneVariant: VariantMutationResult;
    createConfigurationTemplate: ConfigurationTemplateVersionMutationResult;
    createConfigurationTemplateAlias: ConfigurationTemplateAliasMutationResult;
    createConfigurationTemplateVersion: ConfigurationTemplateVersionMutationResult;
    createCustomAction: CustomActionMutationResult;
    createNode: NodeMutationResult;
    createVariant: VariantMutationResult;
    deleteConfigurationTemplateAlias: DeleteConfigurationTemplateAliasResult;
    deleteConfigurationTemplateVersion: DeleteConfigurationTemplateAliasResult;
    deleteCustomAction?: Maybe<DeleteCustomActionResult>;
    deleteNode: DeleteNodeResult;
    deleteVariant: DeleteVariantResult;
    setAuthorSettings: SetSimpleSettingsResult;
    setModuleConfiguration: SetModuleConfigurationResult;
    setSourceSettings: SetSimpleSettingsResult;
    setTaxonomiesSettings: SetTaxonomiesSettingsResult;
    updateConfigurationTemplateAlias: ConfigurationTemplateAliasMutationResult;
    updateCustomAction: CustomActionMutationResult;
    updateNode: NodeMutationResult;
};
export declare type MutationCloneVariantArgs = {
    input: CloneVariantInput;
};
export declare type MutationCreateConfigurationTemplateArgs = {
    input: CreateConfigurationTemplateVersionInput;
};
export declare type MutationCreateConfigurationTemplateAliasArgs = {
    input: CreateConfigurationTemplateAliasInput;
};
export declare type MutationCreateConfigurationTemplateVersionArgs = {
    input: CreateConfigurationTemplateVersionInput;
};
export declare type MutationCreateCustomActionArgs = {
    input: CreateCustomActionInput;
    variantId: Scalars["ID"];
};
export declare type MutationCreateNodeArgs = {
    input: CreateNodeInput;
};
export declare type MutationCreateVariantArgs = {
    input: CreateVariantInput;
};
export declare type MutationDeleteConfigurationTemplateAliasArgs = {
    configurationTemplateName: Scalars["String"];
    name: Scalars["String"];
};
export declare type MutationDeleteConfigurationTemplateVersionArgs = {
    configurationTemplateName: Scalars["String"];
    id: Scalars["ID"];
};
export declare type MutationDeleteCustomActionArgs = {
    id: Scalars["UUID"];
    variantId: Scalars["ID"];
};
export declare type MutationDeleteNodeArgs = {
    id: Scalars["UUID"];
};
export declare type MutationDeleteVariantArgs = {
    id: Scalars["ID"];
};
export declare type MutationSetAuthorSettingsArgs = {
    input: AuthorsSettingsInput;
};
export declare type MutationSetModuleConfigurationArgs = {
    configuration: Scalars["JSONObject"];
    moduleCodeName: Scalars["String"];
    nodeId: Scalars["UUID"];
    variantId: Scalars["ID"];
};
export declare type MutationSetSourceSettingsArgs = {
    input: SourcesSettingsInput;
};
export declare type MutationSetTaxonomiesSettingsArgs = {
    input: TaxonomiesSettingsInput;
    taxonomyCode: Scalars["ID"];
};
export declare type MutationUpdateConfigurationTemplateAliasArgs = {
    configurationTemplateName: Scalars["String"];
    input: UpdateConfigurationTemplateAliasInput;
    name: Scalars["String"];
};
export declare type MutationUpdateCustomActionArgs = {
    id: Scalars["UUID"];
    input: UpdateCustomActionInput;
    variantId: Scalars["ID"];
};
export declare type MutationUpdateNodeArgs = {
    id: Scalars["UUID"];
    input: UpdateNodeInput;
};
export declare type Node = {
    __typename?: "Node";
    additionalProperties?: Maybe<Scalars["JSONObject"]>;
    ancestors: Array<Node>;
    breadcrumbs: Array<Breadcrumb>;
    category?: Maybe<CategoryReference>;
    children: Array<Node>;
    config?: Maybe<VariantConfiguration>;
    domain?: Maybe<Scalars["Domain"]>;
    id: Scalars["UUID"];
    idPath: Scalars["ID"];
    name: Scalars["String"];
    parent?: Maybe<Node>;
    slug: Scalars["String"];
};
export declare type NodeConfigArgs = {
    variantId: Scalars["ID"];
};
export declare type NodeAdditionalPropertiesInput = {
    id?: Maybe<Scalars["String"]>;
};
export declare type NodeMutationResult = SimpleResultUuid & {
    __typename?: "NodeMutationResult";
    affectedId: Scalars["UUID"];
    data?: Maybe<Node>;
    errors?: Maybe<Array<ResultError>>;
    status: SimpleResultStatusEnum;
};
export declare type NodeReference = {
    __typename?: "NodeReference";
    node: Node;
};
export declare enum NotNullValueValidateDirectivePolicy {
    Resolver = "RESOLVER",
    Throw = "THROW"
}
export declare type OrderedListBlock = ContentBlock & {
    __typename?: "OrderedListBlock";
    entries: Array<Scalars["String"]>;
    indentLevel: Scalars["Int"];
    startValue: Scalars["Int"];
    style: Scalars["String"];
    styleType: ListStyleEnum;
    type: Scalars["String"];
};
export declare type PageInfo = {
    __typename?: "PageInfo";
    endCursor?: Maybe<Scalars["ContentCursor"]>;
    hasNextPage?: Maybe<Scalars["Boolean"]>;
    hasPreviousPage?: Maybe<Scalars["Boolean"]>;
    startCursor?: Maybe<Scalars["ContentCursor"]>;
};
export declare type ParagraphBlock = ContentBlock & {
    __typename?: "ParagraphBlock";
    text: Scalars["String"];
    type: Scalars["String"];
};
export declare type PreformattedBlock = ContentBlock & {
    __typename?: "PreformattedBlock";
    text: Scalars["String"];
    type: Scalars["String"];
};
export declare type PublicationDates = {
    __typename?: "PublicationDates";
    creationTime?: Maybe<Scalars["DateTime"]>;
    expirationTime?: Maybe<Scalars["DateTime"]>;
    modificationTime?: Maybe<Scalars["DateTime"]>;
};
export declare type PublicationDatesCreationTimeArgs = {
    format?: Maybe<Scalars["String"]>;
    tz?: Maybe<Scalars["String"]>;
};
export declare type PublicationDatesExpirationTimeArgs = {
    format?: Maybe<Scalars["String"]>;
    tz?: Maybe<Scalars["String"]>;
};
export declare type PublicationDatesModificationTimeArgs = {
    format?: Maybe<Scalars["String"]>;
    tz?: Maybe<Scalars["String"]>;
};
export declare type PublicationPoint = {
    __typename?: "PublicationPoint";
    category: Topic;
    id: Scalars["ID"];
    isMain: Scalars["Boolean"];
    isPrimary: Scalars["Boolean"];
    node: Node;
    url?: Maybe<Scalars["URL"]>;
};
export declare type PublishedContent = Author | Source | Story | Topic;
export declare type Query = {
    __typename?: "Query";
    archive?: Maybe<Archive>;
    author?: Maybe<Author>;
    authors: AuthorSearchResult;
    collection?: Maybe<Collection>;
    configurationTemplate?: Maybe<ConfigurationTemplate>;
    configurationTemplates: Array<Maybe<ConfigurationTemplate>>;
    content?: Maybe<PublishedContent>;
    contents: ContentSearchResult;
    features: Array<Scalars["String"]>;
    name: Scalars["String"];
    namespaceId: Scalars["ID"];
    node?: Maybe<Node>;
    nodes: Array<Node>;
    section?: Maybe<Section>;
    sectionGroup?: Maybe<SectionGroup>;
    serviceId: Scalars["ID"];
    site?: Maybe<Site>;
    source?: Maybe<Source>;
    sources: SourceSearchResult;
    stories: StorySearchResult;
    story?: Maybe<Story>;
    topic?: Maybe<Topic>;
    topics: TopicSearchResult;
    typesSettings?: Maybe<TypesSettings>;
    variant?: Maybe<Variant>;
    variants: Array<Variant>;
};
export declare type QueryAuthorArgs = {
    id?: Maybe<Scalars["UUID"]>;
    publicationId?: Maybe<Scalars["ID"]>;
    revision?: Maybe<Scalars["BigInt"]>;
};
export declare type QueryAuthorsArgs = {
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    filter?: Maybe<AuthorFilterInput>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
    limit?: Maybe<Scalars["Int"]>;
    offset?: Maybe<Scalars["Int"]>;
    sortBy?: Maybe<Array<AuthorSortByInput>>;
};
export declare type QueryCollectionArgs = {
    id: Scalars["UUID"];
};
export declare type QueryConfigurationTemplateArgs = {
    name: Scalars["String"];
};
export declare type QueryContentArgs = {
    id: Scalars["UUID"];
    revision?: Maybe<Scalars["BigInt"]>;
};
export declare type QueryContentsArgs = {
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    filter?: Maybe<ContentFilterInput>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
    limit?: Maybe<Scalars["Int"]>;
    offset?: Maybe<Scalars["Int"]>;
    sortBy?: Maybe<Array<ContentSortByInput>>;
};
export declare type QueryNodeArgs = {
    categoryId?: Maybe<Scalars["UUID"]>;
    id?: Maybe<Scalars["ID"]>;
};
export declare type QuerySectionArgs = {
    codeName: Scalars["ID"];
    nodeId: Scalars["ID"];
};
export declare type QuerySectionGroupArgs = {
    codeName: Scalars["ID"];
    nodeId: Scalars["ID"];
};
export declare type QuerySiteArgs = {
    url: Scalars["URL"];
    variantId: Scalars["ID"];
};
export declare type QuerySourceArgs = {
    id?: Maybe<Scalars["UUID"]>;
    publicationId?: Maybe<Scalars["ID"]>;
    revision?: Maybe<Scalars["BigInt"]>;
};
export declare type QuerySourcesArgs = {
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    filter?: Maybe<SourceFilterInput>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
    limit?: Maybe<Scalars["Int"]>;
    offset?: Maybe<Scalars["Int"]>;
    sortBy?: Maybe<Array<SourceSortByInput>>;
};
export declare type QueryStoriesArgs = {
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    filter?: Maybe<StoryFilterInput>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
    limit?: Maybe<Scalars["Int"]>;
    offset?: Maybe<Scalars["Int"]>;
    phrase?: Maybe<Scalars["String"]>;
    similarTo?: Maybe<Scalars["UUID"]>;
    sortBy?: Maybe<Array<StorySortByInput>>;
};
export declare type QueryStoryArgs = {
    id?: Maybe<Scalars["UUID"]>;
    publicationId?: Maybe<Scalars["ID"]>;
    revision?: Maybe<Scalars["BigInt"]>;
};
export declare type QueryTopicArgs = {
    id?: Maybe<Scalars["UUID"]>;
    publicationId?: Maybe<Scalars["ID"]>;
    revision?: Maybe<Scalars["BigInt"]>;
};
export declare type QueryTopicsArgs = {
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    filter?: Maybe<TopicFilterInput>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
    limit?: Maybe<Scalars["Int"]>;
    offset?: Maybe<Scalars["Int"]>;
    sortBy?: Maybe<Array<TopicSortByInput>>;
};
export declare type QueryVariantArgs = {
    id: Scalars["ID"];
};
export declare enum RangeValidateDirectivePolicy {
    Resolver = "RESOLVER",
    Throw = "THROW"
}
export declare type Recommendation = {
    __typename?: "Recommendation";
    data?: Maybe<RecommendationData>;
    event?: Maybe<RecommendationPeriod>;
    extensions: Array<Extension>;
    id: Scalars["UUID"];
    leads: Array<RecommendationLead>;
};
export declare type RecommendationDataArgs = {
    variantName?: Maybe<Scalars["String"]>;
};
export declare type RecommendationExtensionsArgs = {
    type?: Maybe<Scalars["String"]>;
};
export declare type RecommendationLeadsArgs = {
    role?: Maybe<Scalars["String"]>;
};
export declare type RecommendationAuthorReference = {
    __typename?: "RecommendationAuthorReference";
    author?: Maybe<Author>;
    name?: Maybe<Scalars["String"]>;
};
export declare type RecommendationData = {
    __typename?: "RecommendationData";
    authors: Array<RecommendationAuthorReference>;
    image?: Maybe<MainImageReference>;
    kind?: Maybe<Term>;
    prefix?: Maybe<Scalars["String"]>;
    sources: Array<RecommendationSourceReference>;
    story?: Maybe<Story>;
    subtitle?: Maybe<Scalars["String"]>;
    summary?: Maybe<Scalars["String"]>;
    title?: Maybe<Scalars["String"]>;
    topics?: Maybe<Array<RecommendationTopicReference>>;
    url?: Maybe<Scalars["URL"]>;
};
export declare type RecommendationDataTopicsArgs = {
    kind?: Maybe<Scalars["String"]>;
};
export declare type RecommendationLead = {
    __typename?: "RecommendationLead";
    id: Scalars["String"];
    image?: Maybe<MainImageReference>;
    role?: Maybe<Term>;
    text?: Maybe<Scalars["String"]>;
    title?: Maybe<Scalars["String"]>;
};
export declare type RecommendationPeriod = {
    __typename?: "RecommendationPeriod";
    endTime: Scalars["DateTime"];
    startTime: Scalars["DateTime"];
};
export declare type RecommendationPeriodEndTimeArgs = {
    format?: Maybe<Scalars["String"]>;
    tz?: Maybe<Scalars["String"]>;
};
export declare type RecommendationPeriodStartTimeArgs = {
    format?: Maybe<Scalars["String"]>;
    tz?: Maybe<Scalars["String"]>;
};
export declare type RecommendationSourceReference = {
    __typename?: "RecommendationSourceReference";
    name?: Maybe<Scalars["String"]>;
    source?: Maybe<Source>;
};
export declare type RecommendationTopicReference = {
    __typename?: "RecommendationTopicReference";
    name?: Maybe<Scalars["String"]>;
    topic?: Maybe<Topic>;
};
export declare type ResultError = {
    __typename?: "ResultError";
    code: Scalars["String"];
    message: Scalars["String"];
    path?: Maybe<Array<Scalars["String"]>>;
};
export declare type RingUser = {
    __typename?: "RingUser";
    email?: Maybe<Scalars["String"]>;
    id: Scalars["UUID"];
    name?: Maybe<Scalars["String"]>;
};
export declare type Section = {
    __typename?: "Section";
    codeName: Scalars["ID"];
    items?: Maybe<SectionItemsResult>;
    nodeId: Scalars["ID"];
    options?: Maybe<Scalars["JSONObject"]>;
    title?: Maybe<Scalars["String"]>;
    url?: Maybe<Scalars["URL"]>;
};
export declare type SectionItemsArgs = {
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
};
export declare type SectionAuthorReference = {
    __typename?: "SectionAuthorReference";
    name?: Maybe<Scalars["String"]>;
};
export declare type SectionGroup = {
    __typename?: "SectionGroup";
    codeName: Scalars["ID"];
    sections: Array<Section>;
    title?: Maybe<Scalars["String"]>;
    url?: Maybe<Scalars["URL"]>;
};
export declare type SectionGroupSectionsArgs = {
    codeName?: Maybe<Scalars["ID"]>;
};
export declare type SectionItem = {
    __typename?: "SectionItem";
    authors: Array<SectionAuthorReference>;
    creationTime?: Maybe<Scalars["DateTime"]>;
    emotions?: Maybe<Array<Emotion>>;
    event?: Maybe<EventDates>;
    externalUrl?: Maybe<Scalars["URL"]>;
    flags?: Maybe<Array<Term>>;
    id?: Maybe<Scalars["UUID"]>;
    image?: Maybe<MainImageReference>;
    lead?: Maybe<Scalars["String"]>;
    leads: Array<StoryLead>;
    license?: Maybe<License>;
    modificationTime?: Maybe<Scalars["DateTime"]>;
    ordering?: Maybe<Scalars["Float"]>;
    ordinalNumber?: Maybe<Scalars["Float"]>;
    orginalContent?: Maybe<PublishedContent>;
    originalContent?: Maybe<PublishedContent>;
    pinnedPosition?: Maybe<Scalars["Int"]>;
    prefix?: Maybe<Scalars["String"]>;
    role?: Maybe<Term>;
    seeAlsoLinks: Array<SeeAlsoLink>;
    sources: Array<SectionSourceReference>;
    statistics: Array<StoryStatistic>;
    subtitle?: Maybe<Scalars["String"]>;
    system?: Maybe<SectionItemSystemEnum>;
    teasers: Array<StoryLead>;
    title?: Maybe<Scalars["String"]>;
    titles: Array<StoryExtraTitle>;
    topics: Array<SectionTopicReference>;
    url: Scalars["URL"];
    variants: Array<SectionItemVariant>;
};
export declare type SectionItemCreationTimeArgs = {
    format?: Maybe<Scalars["String"]>;
    tz?: Maybe<Scalars["String"]>;
};
export declare type SectionItemLeadsArgs = {
    role?: Maybe<Array<Scalars["String"]>>;
};
export declare type SectionItemModificationTimeArgs = {
    format?: Maybe<Scalars["String"]>;
    tz?: Maybe<Scalars["String"]>;
};
export declare type SectionItemTeasersArgs = {
    role?: Maybe<Array<Scalars["String"]>>;
};
export declare type SectionItemTitlesArgs = {
    role?: Maybe<Scalars["String"]>;
};
export declare type SectionItemTopicsArgs = {
    taxonomy?: Maybe<Scalars["String"]>;
};
export declare type SectionItemEdge = {
    __typename?: "SectionItemEdge";
    cursor: Scalars["ContentCursor"];
    node: SectionItem;
};
export declare enum SectionItemSystemEnum {
    Base = "BASE",
    Recommendation = "RECOMMENDATION"
}
export declare type SectionItemVariant = {
    __typename?: "SectionItemVariant";
    image?: Maybe<MainImageReference>;
    isPreferred?: Maybe<Scalars["Boolean"]>;
    title?: Maybe<Scalars["String"]>;
};
export declare type SectionItemsResult = {
    __typename?: "SectionItemsResult";
    edges: Array<SectionItemEdge>;
    pageInfo?: Maybe<PageInfo>;
    total: Scalars["Int"];
};
export declare type SectionSourceReference = {
    __typename?: "SectionSourceReference";
    name?: Maybe<Scalars["String"]>;
};
export declare type SectionTopicReference = {
    __typename?: "SectionTopicReference";
    name?: Maybe<Scalars["String"]>;
};
export declare type SeeAlsoLink = {
    __typename?: "SeeAlsoLink";
    noFollow?: Maybe<Scalars["Boolean"]>;
    role?: Maybe<Term>;
    title?: Maybe<Scalars["String"]>;
    url?: Maybe<Scalars["URL"]>;
};
export declare type SetModuleConfigurationResult = SimpleResult & {
    __typename?: "SetModuleConfigurationResult";
    affectedId: Scalars["ID"];
    data?: Maybe<ModuleConfiguration>;
    errors?: Maybe<Array<ResultError>>;
    status: SimpleResultStatusEnum;
};
export declare type SetSimpleSettingsResult = SimpleResult & {
    __typename?: "SetSimpleSettingsResult";
    affectedId?: Maybe<Scalars["ID"]>;
    data?: Maybe<SimpleTypeSettings>;
    errors?: Maybe<Array<ResultError>>;
    status: SimpleResultStatusEnum;
};
export declare type SetTaxonomiesSettingsResult = SimpleResult & {
    __typename?: "SetTaxonomiesSettingsResult";
    affectedId: Scalars["ID"];
    data?: Maybe<TaxonomiesSettings>;
    errors?: Maybe<Array<ResultError>>;
    status: SimpleResultStatusEnum;
};
export declare type SimpleResult = {
    affectedId?: Maybe<Scalars["ID"]>;
    errors?: Maybe<Array<ResultError>>;
    status: SimpleResultStatusEnum;
};
export declare enum SimpleResultStatusEnum {
    Error = "ERROR",
    Ok = "OK"
}
export declare type SimpleResultUuid = {
    affectedId: Scalars["UUID"];
    errors?: Maybe<Array<ResultError>>;
    status: SimpleResultStatusEnum;
};
export declare enum SimpleSortOrderEnum {
    Asc = "ASC",
    Desc = "DESC"
}
export declare type SimpleTypeSettings = {
    __typename?: "SimpleTypeSettings";
    path?: Maybe<Scalars["String"]>;
};
export declare enum SimpleTypeSortFieldsEnum {
    CreationTime = "CREATION_TIME",
    Id = "ID",
    ModificationTime = "MODIFICATION_TIME",
    Name = "NAME",
    NameSlug = "NAME_SLUG",
    Score = "SCORE"
}
export declare type Site = {
    __typename?: "Site";
    data?: Maybe<SiteData>;
    headers?: Maybe<Headers>;
    statusCode: Scalars["Int"];
};
export declare type SiteContent = Author | CustomAction | SiteNode | Source | Story | Topic;
export declare type SiteData = {
    __typename?: "SiteData";
    content?: Maybe<SiteContent>;
    node: SiteNode;
};
export declare type SiteNode = {
    __typename?: "SiteNode";
    additionalProperties?: Maybe<Scalars["JSONObject"]>;
    ancestors: Array<SiteNode>;
    breadcrumbs: Array<Breadcrumb>;
    category?: Maybe<CategoryReference>;
    children: Array<SiteNode>;
    config: VariantConfiguration;
    id: Scalars["UUID"];
    idPath: Scalars["ID"];
    name: Scalars["String"];
    parent?: Maybe<SiteNode>;
    slug: Scalars["String"];
};
export declare type SlotBlock = ContentBlock & {
    __typename?: "SlotBlock";
    alignment: ContentElementAlignmentEnum;
    data?: Maybe<Scalars["JSONObject"]>;
    kind?: Maybe<Term>;
    name: Scalars["String"];
    type: Scalars["String"];
};
export declare type Source = {
    __typename?: "Source";
    description?: Maybe<ContentDescription>;
    extensions: Array<Extension>;
    id: Scalars["UUID"];
    image?: Maybe<MainImageReference>;
    images: Array<MainImageReference>;
    name: Scalars["String"];
    publicationPoint?: Maybe<PublicationPoint>;
    publicationPoints: Array<PublicationPoint>;
    system: SystemData;
    tagline?: Maybe<Scalars["String"]>;
    url?: Maybe<Scalars["URL"]>;
};
export declare type SourceExtensionsArgs = {
    type?: Maybe<Scalars["String"]>;
};
export declare type SourceImagesArgs = {
    role?: Maybe<Scalars["String"]>;
};
export declare type SourceEdge = {
    __typename?: "SourceEdge";
    cursor?: Maybe<Scalars["ContentCursor"]>;
    node: Source;
};
export declare type SourceFilterInput = {
    creationTime?: Maybe<DateTimeFilterInput>;
    id?: Maybe<UuidFilterInput>;
    marker?: Maybe<MarkerFilterInput>;
};
export declare type SourceSearchResult = {
    __typename?: "SourceSearchResult";
    edges: Array<SourceEdge>;
    pageInfo?: Maybe<PageInfo>;
    total?: Maybe<Scalars["Int"]>;
};
export declare type SourceSortByInput = {
    field: SimpleTypeSortFieldsEnum;
    order?: Maybe<SimpleSortOrderEnum>;
};
export declare type SourcesSettingsInput = {
    path?: Maybe<Scalars["String"]>;
};
export declare type Story = {
    __typename?: "Story";
    authors: Array<StoryAuthorReference>;
    canonical?: Maybe<StoryCanonical>;
    content: Array<Content>;
    date?: Maybe<PublicationDates>;
    extensions: Array<Extension>;
    flags: Array<Term>;
    id: Scalars["UUID"];
    image?: Maybe<MainImageReference>;
    kind?: Maybe<Term>;
    leads: Array<StoryLead>;
    license?: Maybe<License>;
    link?: Maybe<LinkObject>;
    mainPublicationPoint: PublicationPoint;
    name: Scalars["String"];
    ordinalNumber?: Maybe<Scalars["Float"]>;
    primaryPublicationPoint: PublicationPoint;
    publicationPoint: PublicationPoint;
    publicationPoints: Array<PublicationPoint>;
    sources: Array<StorySourceReference>;
    statistics: Array<StoryStatistic>;
    stories: Array<StoryRelatedStory>;
    system: SystemData;
    title: Scalars["String"];
    titles: Array<StoryExtraTitle>;
    topics?: Maybe<Array<Maybe<StoryTopicReference>>>;
};
export declare type StoryContentArgs = {
    role?: Maybe<Scalars["String"]>;
};
export declare type StoryExtensionsArgs = {
    type?: Maybe<Scalars["String"]>;
};
export declare type StoryLeadsArgs = {
    role?: Maybe<Scalars["String"]>;
};
export declare type StoryStoriesArgs = {
    role?: Maybe<Scalars["String"]>;
};
export declare type StoryTitlesArgs = {
    role?: Maybe<Scalars["String"]>;
};
export declare type StoryTopicsArgs = {
    kind?: Maybe<Scalars["String"]>;
};
export declare type StoryAuthorReference = {
    __typename?: "StoryAuthorReference";
    author: Author;
};
export declare type StoryCanonical = {
    __typename?: "StoryCanonical";
    url?: Maybe<Scalars["URL"]>;
};
export declare type StoryEdge = {
    __typename?: "StoryEdge";
    cursor?: Maybe<Scalars["ContentCursor"]>;
    node: Story;
};
export declare type StoryExtraTitle = {
    __typename?: "StoryExtraTitle";
    id?: Maybe<Scalars["ID"]>;
    role?: Maybe<Term>;
    text?: Maybe<Scalars["String"]>;
};
export declare type StoryFilterInput = {
    author?: Maybe<UuidFilterInput>;
    category?: Maybe<UuidFilterInput>;
    collection?: Maybe<UuidFilterInput>;
    creationTime?: Maybe<DateTimeFilterInput>;
    expirationTime?: Maybe<DateTimeFilterInput>;
    flag?: Maybe<StringFilterInput>;
    id?: Maybe<UuidFilterInput>;
    kind?: Maybe<StringFilterInput>;
    marker?: Maybe<MarkerFilterInput>;
    modificationTime?: Maybe<DateTimeFilterInput>;
    source?: Maybe<UuidFilterInput>;
    topic?: Maybe<UuidFilterInput>;
};
export declare type StoryLead = {
    __typename?: "StoryLead";
    id: Scalars["String"];
    image?: Maybe<MainImageReference>;
    role?: Maybe<Term>;
    text?: Maybe<Scalars["String"]>;
    title?: Maybe<Scalars["String"]>;
};
export declare type StoryRelatedStory = {
    __typename?: "StoryRelatedStory";
    role?: Maybe<Term>;
    story?: Maybe<Story>;
    title?: Maybe<Scalars["String"]>;
    url?: Maybe<Scalars["URL"]>;
};
export declare type StorySearchResult = {
    __typename?: "StorySearchResult";
    edges: Array<StoryEdge>;
    pageInfo?: Maybe<PageInfo>;
    total?: Maybe<Scalars["Int"]>;
};
export declare type StorySortByInput = {
    field: StorySortFieldsEnum;
    order?: Maybe<SimpleSortOrderEnum>;
};
export declare enum StorySortFieldsEnum {
    CreationTime = "CREATION_TIME",
    Id = "ID",
    ModificationTime = "MODIFICATION_TIME",
    OrdinalNumber = "ORDINAL_NUMBER",
    Score = "SCORE",
    Title = "TITLE",
    TitleSlug = "TITLE_SLUG"
}
export declare type StorySourceReference = {
    __typename?: "StorySourceReference";
    name?: Maybe<Scalars["String"]>;
    source: Source;
    url?: Maybe<Scalars["String"]>;
};
export declare type StoryStatistic = {
    __typename?: "StoryStatistic";
    name: Scalars["String"];
    value: Scalars["Float"];
};
export declare type StoryTopicReference = {
    __typename?: "StoryTopicReference";
    topic?: Maybe<Topic>;
};
export declare type StringFilterInput = {
    in?: Maybe<Array<Scalars["String"]>>;
    notIn?: Maybe<Array<Scalars["String"]>>;
};
export declare type SystemData = {
    __typename?: "SystemData";
    revision?: Maybe<Scalars["BigInt"]>;
};
export declare type TableBlock = ContentBlock & {
    __typename?: "TableBlock";
    rows: Array<TableBlockRow>;
    type: Scalars["String"];
};
export declare type TableBlockCell = {
    __typename?: "TableBlockCell";
    alignment?: Maybe<ContentElementAlignmentEnum>;
    classes: Array<Scalars["String"]>;
    colspan?: Maybe<Scalars["Int"]>;
    isHeader?: Maybe<Scalars["Boolean"]>;
    link?: Maybe<LinkObject>;
    rowspan?: Maybe<Scalars["Int"]>;
    text?: Maybe<Scalars["String"]>;
};
export declare type TableBlockRow = {
    __typename?: "TableBlockRow";
    cells: Array<TableBlockCell>;
};
export declare type TaxonomiesSettings = {
    __typename?: "TaxonomiesSettings";
    path?: Maybe<Scalars["String"]>;
    previousPaths: Array<Scalars["String"]>;
    taxonomyCode: Scalars["ID"];
    taxonomyName: Scalars["String"];
};
export declare type TaxonomiesSettingsInput = {
    path?: Maybe<Scalars["String"]>;
    taxonomyName?: Maybe<Scalars["String"]>;
};
export declare type Term = {
    __typename?: "Term";
    code: Scalars["String"];
    name: Scalars["String"];
};
export declare type Topic = {
    __typename?: "Topic";
    description?: Maybe<ContentDescription>;
    editorialName: Scalars["String"];
    extensions: Array<Extension>;
    id: Scalars["UUID"];
    image?: Maybe<MainImageReference>;
    images: Array<MainImageReference>;
    kind: Term;
    name: Scalars["String"];
    nodeReference?: Maybe<NodeReference>;
    publicationPoint?: Maybe<PublicationPoint>;
    publicationPoints: Array<PublicationPoint>;
    system: SystemData;
    topics: Array<TopicTopicReference>;
};
export declare type TopicExtensionsArgs = {
    type?: Maybe<Scalars["String"]>;
};
export declare type TopicImagesArgs = {
    role?: Maybe<Scalars["String"]>;
};
export declare type TopicEdge = {
    __typename?: "TopicEdge";
    cursor?: Maybe<Scalars["ContentCursor"]>;
    node: Topic;
};
export declare type TopicFilterInput = {
    creationTime?: Maybe<DateTimeFilterInput>;
    flag?: Maybe<StringFilterInput>;
    id?: Maybe<UuidFilterInput>;
    kind?: Maybe<StringFilterInput>;
    marker?: Maybe<MarkerFilterInput>;
    name?: Maybe<ExpressionFilterInput>;
    topic?: Maybe<UuidFilterInput>;
};
export declare type TopicSearchResult = {
    __typename?: "TopicSearchResult";
    edges: Array<TopicEdge>;
    pageInfo?: Maybe<PageInfo>;
    total?: Maybe<Scalars["Int"]>;
};
export declare type TopicSortByInput = {
    field: SimpleTypeSortFieldsEnum;
    order?: Maybe<SimpleSortOrderEnum>;
};
export declare type TopicTopicReference = {
    __typename?: "TopicTopicReference";
    topic?: Maybe<Topic>;
};
export declare type TypesSettings = {
    __typename?: "TypesSettings";
    author: SimpleTypeSettings;
    source: SimpleTypeSettings;
    taxonomies: Array<TaxonomiesSettings>;
};
export declare type UnorderedListBlock = ContentBlock & {
    __typename?: "UnorderedListBlock";
    entries: Array<Scalars["String"]>;
    indentLevel: Scalars["Int"];
    style: Scalars["String"];
    styleType: ListStyleEnum;
    type: Scalars["String"];
};
export declare type UpdateConfigurationTemplateAliasInput = {
    configurationTemplateVersion: Scalars["String"];
};
export declare type UpdateCustomActionInput = {
    action?: Maybe<Scalars["String"]>;
    priority?: Maybe<Scalars["Int"]>;
    regexp?: Maybe<Scalars["String"]>;
};
export declare type UpdateNodeInput = {
    additionalProperties?: Maybe<NodeAdditionalPropertiesInput>;
    categoryId?: Maybe<Scalars["UUID"]>;
    name: Scalars["String"];
};
export declare type UuidFilterInput = {
    in?: Maybe<Array<Scalars["UUID"]>>;
    notIn?: Maybe<Array<Scalars["UUID"]>>;
};
export declare type ValidatedInputError = {
    error: ValidatedInputErrorInstance;
    message: Scalars["String"];
    path: Array<Scalars["String"]>;
};
export declare type ValidatedInputErrorInstance = {
    message: Scalars["String"];
};
export declare type ValidatedInputErrorOutput = {
    __typename?: "ValidatedInputErrorOutput";
    message: Scalars["String"];
    path: Array<Scalars["String"]>;
};
export declare type Variant = {
    __typename?: "Variant";
    changelog: Array<ChangeLog>;
    configurationStructure: VariantConfigurationStructure;
    customActions: Array<CustomAction>;
    id: Scalars["ID"];
    structure: Scalars["JSONObject"];
};
export declare type VariantChangelogArgs = {
    creationTime?: Maybe<Scalars["String"]>;
};
export declare type VariantConfiguration = {
    __typename?: "VariantConfiguration";
    config: Array<ModuleConfiguration>;
    variant?: Maybe<Variant>;
};
export declare type VariantConfigurationConfigArgs = {
    codeName: Scalars["String"];
};
export declare type VariantConfigurationStructure = {
    __typename?: "VariantConfigurationStructure";
    configurationTemplateAlias?: Maybe<ConfigurationTemplateAlias>;
    configurationTemplateVersion: ConfigurationTemplateVersion;
};
export declare type VariantMutationResult = SimpleResult & {
    __typename?: "VariantMutationResult";
    affectedId: Scalars["ID"];
    data?: Maybe<Variant>;
    errors?: Maybe<Array<ResultError>>;
    status: SimpleResultStatusEnum;
};
export declare type Website = {
    __typename?: "Website";
    category?: Maybe<Topic>;
    extensions: Array<Extension>;
    id: Scalars["UUID"];
    name: Scalars["String"];
};
export declare type WebsiteExtensionsArgs = {
    type?: Maybe<Scalars["String"]>;
};
