// approximate typecheck of Imgur's embedded data scripts
export interface postDataJSON {
    id: string;
    account_id: number;
    title: string;
    description: string;
    view_count: number;
    upvote_count: number;
    downvote_count: number;
    point_count: number;
    image_count: number;
    comment_count: number;
    favorite_count: number;
    virality: number;
    score: number;
    in_most_viral: boolean;
    is_album: boolean;
    is_mature: boolean;
    cover_id: string;
    created_at: string;
    updated_at: unknown;
    url: string;
    privacy: string;
    vote: unknown;
    favorite: boolean;
    is_ad: boolean;
    ad_type: number;
    ad_url: string;
    include_album_ads: boolean;
    shared_with_community: boolean;
    is_pending: boolean;
    platform: string;
    ad_config: AdConfig;
    account: Account;
    cover: Cover;
    tags: Tag[];
    media: Medum[];
    display: unknown[];
}

export interface AdConfig {
    show_ads: boolean;
    show_ad_level: number;
    ad_sense_client_id: string;
    safe_flags: string[];
    high_risk_flags: unknown[];
    unsafe_flags: unknown[];
    wall_unsafe_flags: unknown[];
}

export interface Account {
    id: number;
    username: string;
    avatar_url: string;
    created_at: string;
}

export interface Cover {
    id: string;
    account_id: number;
    mime_type: string;
    type: string;
    name: string;
    basename: string;
    url: string;
    ext: string;
    width: number;
    height: number;
    size: number;
    metadata: Metadata;
    created_at: string;
    updated_at: unknown;
}

export interface Metadata {
    title: string;
    description: string;
    is_animated: boolean;
    is_looping: boolean;
    duration: number;
    has_sound: boolean;
}

export interface Tag {
    tag: string;
    display: string;
    background_id: string;
    accent: string;
    is_promoted: boolean;
}

export interface Medum {
    id: string;
    account_id: number;
    mime_type: string;
    type: string;
    name: string;
    basename: string;
    url: string;
    ext: string;
    width: number;
    height: number;
    size: number;
    metadata: Metadata2;
    created_at: string;
    updated_at: unknown;
}

export interface Metadata2 {
    title: string;
    description: string;
    is_animated: boolean;
    is_looping: boolean;
    duration: number;
    has_sound: boolean;
}
