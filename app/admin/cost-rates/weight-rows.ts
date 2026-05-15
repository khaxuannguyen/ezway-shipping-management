import { CostRateType } from "@prisma/client";

export type CostRateWeightRow = {
  label: string;
  range: string;
  typeLabel: string;
  minWeight: number;
  maxWeight: number | null;
  rateType: CostRateType;
  sortOrder: number;
};

export const DEFAULT_COST_RATE_ROWS: CostRateWeightRow[] = [
  { label: "0.5", range: "0 - 0.5 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 0, maxWeight: 0.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 1 },
  { label: "1.0", range: "0.5 - 1.0 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 0.5, maxWeight: 1, rateType: CostRateType.FIXED_TOTAL, sortOrder: 2 },
  { label: "1.5", range: "1.0 - 1.5 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 1, maxWeight: 1.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 3 },
  { label: "2.0", range: "1.5 - 2.0 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 1.5, maxWeight: 2, rateType: CostRateType.FIXED_TOTAL, sortOrder: 4 },
  { label: "2.5", range: "2.0 - 2.5 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 2, maxWeight: 2.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 5 },
  { label: "3.0", range: "2.5 - 3.0 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 2.5, maxWeight: 3, rateType: CostRateType.FIXED_TOTAL, sortOrder: 6 },
  { label: "3.5", range: "3.0 - 3.5 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 3, maxWeight: 3.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 7 },
  { label: "4.0", range: "3.5 - 4.0 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 3.5, maxWeight: 4, rateType: CostRateType.FIXED_TOTAL, sortOrder: 8 },
  { label: "4.5", range: "4.0 - 4.5 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 4, maxWeight: 4.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 9 },
  { label: "5.0", range: "4.5 - 5.0 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 4.5, maxWeight: 5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 10 },
  { label: "5.5", range: "5.0 - 5.5 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 5, maxWeight: 5.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 11 },
  { label: "6.0", range: "5.5 - 6.0 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 5.5, maxWeight: 6, rateType: CostRateType.FIXED_TOTAL, sortOrder: 12 },
  { label: "6.5", range: "6.0 - 6.5 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 6, maxWeight: 6.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 13 },
  { label: "7.0", range: "6.5 - 7.0 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 6.5, maxWeight: 7, rateType: CostRateType.FIXED_TOTAL, sortOrder: 14 },
  { label: "7.5", range: "7.0 - 7.5 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 7, maxWeight: 7.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 15 },
  { label: "8.0", range: "7.5 - 8.0 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 7.5, maxWeight: 8, rateType: CostRateType.FIXED_TOTAL, sortOrder: 16 },
  { label: "8.5", range: "8.0 - 8.5 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 8, maxWeight: 8.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 17 },
  { label: "9.0", range: "8.5 - 9.0 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 8.5, maxWeight: 9, rateType: CostRateType.FIXED_TOTAL, sortOrder: 18 },
  { label: "9.5", range: "9.0 - 9.5 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 9, maxWeight: 9.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 19 },
  { label: "10.0", range: "9.5 - 10.0 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 9.5, maxWeight: 10, rateType: CostRateType.FIXED_TOTAL, sortOrder: 20 },
  { label: "10.5", range: "10.0 - 10.5 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 10, maxWeight: 10.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 21 },
  { label: "11.0", range: "10.5 - 11.0 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 10.5, maxWeight: 11, rateType: CostRateType.FIXED_TOTAL, sortOrder: 22 },
  { label: "11.5", range: "11.0 - 11.5 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 11, maxWeight: 11.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 23 },
  { label: "12.0", range: "11.5 - 12.0 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 11.5, maxWeight: 12, rateType: CostRateType.FIXED_TOTAL, sortOrder: 24 },
  { label: "12.5", range: "12.0 - 12.5 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 12, maxWeight: 12.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 25 },
  { label: "13.0", range: "12.5 - 13.0 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 12.5, maxWeight: 13, rateType: CostRateType.FIXED_TOTAL, sortOrder: 26 },
  { label: "13.5", range: "13.0 - 13.5 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 13, maxWeight: 13.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 27 },
  { label: "14.0", range: "13.5 - 14.0 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 13.5, maxWeight: 14, rateType: CostRateType.FIXED_TOTAL, sortOrder: 28 },
  { label: "14.5", range: "14.0 - 14.5 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 14, maxWeight: 14.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 29 },
  { label: "15.0", range: "14.5 - 15.0 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 14.5, maxWeight: 15, rateType: CostRateType.FIXED_TOTAL, sortOrder: 30 },
  { label: "15.5", range: "15.0 - 15.5 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 15, maxWeight: 15.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 31 },
  { label: "16.0", range: "15.5 - 16.0 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 15.5, maxWeight: 16, rateType: CostRateType.FIXED_TOTAL, sortOrder: 32 },
  { label: "16.5", range: "16.0 - 16.5 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 16, maxWeight: 16.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 33 },
  { label: "17.0", range: "16.5 - 17.0 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 16.5, maxWeight: 17, rateType: CostRateType.FIXED_TOTAL, sortOrder: 34 },
  { label: "17.5", range: "17.0 - 17.5 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 17, maxWeight: 17.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 35 },
  { label: "18.0", range: "17.5 - 18.0 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 17.5, maxWeight: 18, rateType: CostRateType.FIXED_TOTAL, sortOrder: 36 },
  { label: "18.5", range: "18.0 - 18.5 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 18, maxWeight: 18.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 37 },
  { label: "19.0", range: "18.5 - 19.0 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 18.5, maxWeight: 19, rateType: CostRateType.FIXED_TOTAL, sortOrder: 38 },
  { label: "19.5", range: "19.0 - 19.5 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 19, maxWeight: 19.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 39 },
  { label: "20.0", range: "19.5 - 20.0 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 19.5, maxWeight: 20, rateType: CostRateType.FIXED_TOTAL, sortOrder: 40 },
  { label: "20.5", range: "20.0 - 20.5 kg", typeLabel: "Giá lẻ theo mốc", minWeight: 20, maxWeight: 20.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 41 },
  { label: "21-44", range: ">20.5 - 44 kg", typeLabel: "Giá sỉ theo kg", minWeight: 20.5, maxWeight: 44, rateType: CostRateType.PER_KG, sortOrder: 42 },
  { label: "45-99", range: ">44 - 99 kg", typeLabel: "Giá sỉ theo kg", minWeight: 44, maxWeight: 99, rateType: CostRateType.PER_KG, sortOrder: 43 },
  { label: "100-299", range: ">99 - 299 kg", typeLabel: "Giá sỉ theo kg", minWeight: 99, maxWeight: 299, rateType: CostRateType.PER_KG, sortOrder: 44 },
  { label: "300+", range: ">299 - 500 kg", typeLabel: "Giá sỉ theo kg", minWeight: 299, maxWeight: 500, rateType: CostRateType.PER_KG, sortOrder: 45 },
  { label: "500+", range: ">500 kg", typeLabel: "Giá sỉ theo kg", minWeight: 500, maxWeight: null, rateType: CostRateType.PER_KG, sortOrder: 46 },
];
