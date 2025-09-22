export enum ConfigEnum {
  BLOCK_LOW_AND_ABOVE = "BLOCK_LOW_AND_ABOVE",
  BLOCK_MEDIUM_AND_ABOVE = "BLOCK_MEDIUM_AND_ABOVE",
  BLOCK_NONE = "BLOCK_NONE",
  BLOCK_ONLY_HIGH = "BLOCK_ONLY_HIGH",
  HARM_BLOCK_THRESHOLD_UNSPECIFIED = "HARM_BLOCK_THRESHOLD_UNSPECIFIED",
  OFF = "OFF",
}

export type Config = {
  civicIntegrity: ConfigEnum;
  dangerousContent: ConfigEnum;      
  harassmentIntimidation: ConfigEnum;
  hateSpeech: ConfigEnum;
  sexual: ConfigEnum;
}

export const configEnumLabels: Record<ConfigEnum, string> = {
  [ConfigEnum.OFF]: "Desativado",
  [ConfigEnum.BLOCK_NONE]: "Sem Bloqueio",
  [ConfigEnum.BLOCK_LOW_AND_ABOVE]: "Bloqueio Leve e Acima",
  [ConfigEnum.BLOCK_MEDIUM_AND_ABOVE]: "Bloqueio Moderado e Acima",
  [ConfigEnum.BLOCK_ONLY_HIGH]: "Apenas Bloqueio Alto",
  [ConfigEnum.HARM_BLOCK_THRESHOLD_UNSPECIFIED]: "Não Especificado",
}

export const configLabels: Record<keyof Config, string> = {
  civicIntegrity: "Integridade Cívica",
  dangerousContent: "Conteúdo Perigoso",
  harassmentIntimidation: "Assédio / Intimidação",
  hateSpeech: "Discurso de Ódio",
  sexual: "Conteúdo Sexual",
}