export enum ConfigEnum {
  BLOCK_LOW_AND_ABOVE = "BLOCK_LOW_AND_ABOVE",
  BLOCK_MEDIUM_AND_ABOVE = "BLOCK_MEDIUM_AND_ABOVE",
  BLOCK_NONE = "BLOCK_NONE",
  BLOCK_ONLY_HIGH = "BLOCK_ONLY_HIGH",
}

export enum QualityMode {
  MEDIA_RESOLUTION_MEDIUM = "MEDIA_RESOLUTION_MEDIUM",
  MEDIA_RESOLUTION_LOW = "MEDIA_RESOLUTION_LOW"
}

export type Config = {
  civicIntegrity: ConfigEnum;
  dangerousContent: ConfigEnum;      
  harassmentIntimidation: ConfigEnum;
  hateSpeech: ConfigEnum;
  sexual: ConfigEnum;
}

export const configEnumLabels: Record<ConfigEnum, string> = {
  [ConfigEnum.BLOCK_NONE]: "Sem Bloqueio",
  [ConfigEnum.BLOCK_LOW_AND_ABOVE]: "Bloqueia Conteúdo de Leve Risco ou Mais",
  [ConfigEnum.BLOCK_MEDIUM_AND_ABOVE]: "Bloquea Conteúdo de Médio Risco ou Mais",
  [ConfigEnum.BLOCK_ONLY_HIGH]: "Bloqueia Conteúdo de Alto Risco",
}

export const configLabels: Record<keyof Config, string> = {
  civicIntegrity: "Integridade Cívica",
  dangerousContent: "Conteúdo Perigoso",
  harassmentIntimidation: "Assédio / Intimidação",
  hateSpeech: "Discurso de Ódio",
  sexual: "Conteúdo Sexual",
}