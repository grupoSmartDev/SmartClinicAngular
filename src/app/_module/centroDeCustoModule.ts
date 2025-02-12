import { SubCentroDeCusto } from "./subCentroDeCustoModule";

export interface CentroDeCusto{
    id : string;
    tipo : string;
    descricao : string;
    subCentrosCusto? : [SubCentroDeCusto];
}