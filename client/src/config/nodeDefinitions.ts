/**
 * Complete node definitions based on backend ML and GenAI capabilities
 */

import type { NodeType } from "../types/pipeline";
import type { LucideIcon } from "lucide-react";
import {
  Database,
  Filter,
  Scale,
  Droplet,
  Layers,
  Eye,
  Table,
  BarChart3,
  LineChart,
  Info,
  Hash,
  Split,
  TrendingUp,
  Camera,
  Scissors,
  Target,
  Upload,
} from "lucide-react";
import { genaiCategory } from "./genaiNodes";
import { mlAlgorithmsCategory } from "./mlAlgorithms";
import { resultNodes } from "./resultNodes";
import { activityCategory } from "./activityNodes";

export interface NodeCategory {
  id: string;
  label: string;
  icon: LucideIcon;
  nodes: NodeDefinition[];
}

export interface NodeDefinition {
  type: NodeType;
  label: string;
  description: string;
  category: string;
  icon: LucideIcon;
  color: string;
  defaultConfig: Record<string, unknown>;
  configFields?: ConfigField[];
}

export interface ConfigField {
  name: string;
  label: string;
  type:
    | "text"
    | "number"
    | "range"
    | "select"
    | "multiselect"
    | "checkbox"
    | "boolean"
    | "password"
    | "file"
    | "textarea"
    | "json"
    | "array";
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  defaultValue?: unknown;
  description?: string;
  placeholder?: string; // Placeholder text for inputs
  min?: number;
  max?: number;
  step?: number;
  autoFill?: boolean; // Auto-fill from dataset metadata
  conditional?: {
    field: string;
    value?: any;
  }; // Show field conditionally based on another field's value
  conditionalDisplay?: {
    field: string;
    equals?: string | boolean;
    notEquals?: string | boolean;
  }; // Show field conditionally based on another field's value
  itemFields?: ConfigField[]; // For array type - fields for each array item
}

export const nodeCategories: NodeCategory[] = [
  {
    id: "data-sources",
    label: "Data Sources",
    icon: Database,
    nodes: [
      {
        type: "select_dataset",
        label: "Select Dataset",
        description: "Choose from previously uploaded datasets",
        category: "data-sources",
        icon: Database,
        color: "#3bab86",
        defaultConfig: {
          dataset_id: "",
          filename: "",
          n_rows: 0,
          n_columns: 0,
          columns: [],
        },
        configFields: [
          {
            name: "dataset_id",
            label: "Dataset",
            type: "select",
            required: true,
            description: "Select from your uploaded datasets",
          },
        ],
      },
      {
        type: "sample_dataset",
        label: "Sample Dataset",
        description: "Use a built-in sample dataset",
        category: "data-sources",
        icon: Database,
        color: "#8B5CF6",
        defaultConfig: {
          dataset_name: "iris",
        },
        configFields: [
          {
            name: "dataset_name",
            label: "Dataset",
            type: "select",
            options: [
              { value: "iris", label: "Iris (Classification)" },
              { value: "wine", label: "Wine Quality (Classification)" },
              { value: "breast_cancer", label: "Breast Cancer (Classification)" },
              { value: "digits", label: "Digits (Classification)" },
              { value: "titanic", label: "Titanic (Classification)" },
              { value: "penguins", label: "Palmer Penguins (Classification)" },
              { value: "heart_disease", label: "Heart Disease (Classification)" },
              { value: "diabetes", label: "Diabetes (Regression)" },
              { value: "boston", label: "California Housing (Regression)" },
              { value: "tips", label: "Tips (Regression)" },
              { value: "auto_mpg", label: "Auto MPG (Regression)" },
              { value: "student", label: "Student Performance (Regression)" },
              { value: "linnerud", label: "Linnerud (Multivariate)" },
            ],
            defaultValue: "iris",
          },
        ],
      },
      {
        type: "upload_file",
        label: "Upload Dataset",
        description: "Upload your own CSV file",
        category: "data-sources",
        icon: Upload,
        color: "#3B82F6",
        defaultConfig: {
          dataset_id: "",
          filename: "",
          n_rows: 0,
          n_columns: 0,
          columns: [],
        },
        configFields: [
          {
            name: "filename",
            label: "Dataset File",
            type: "file",
            required: true,
            description: "Upload a CSV file",
          },
          {
            name: "dataset_id",
            label: "Dataset ID",
            type: "text",
            required: false,
            description: "Auto-filled after upload",
            autoFill: true,
          },
        ],
      },
    ],
  },
  {
    id: "view",
    label: "View",
    icon: Eye,
    nodes: [
      {
        type: "table_view",
        label: "Table View",
        description: "Display dataset in table format",
        category: "view",
        icon: Table,
        color: "#06B6D4",
        defaultConfig: {
          dataset_id: "",
          max_rows: 100,
          columns_to_show: [],
        },
        configFields: [
          {
            name: "dataset_id",
            label: "Dataset Source",
            type: "text",
            required: true,
            description: "Connect to a data source node",
            autoFill: true,
          },
          {
            name: "max_rows",
            label: "Max Rows to Display",
            type: "number",
            min: 10,
            max: 1000,
            defaultValue: 100,
            description: "Number of rows to show",
          },
        ],
      },
      {
        type: "data_preview",
        label: "Data Preview",
        description: "Quick preview of first and last rows",
        category: "view",
        icon: Eye,
        color: "#8B5CF6",
        defaultConfig: {
          dataset_id: "",
          head_rows: 5,
          tail_rows: 5,
        },
        configFields: [
          {
            name: "dataset_id",
            label: "Dataset Source",
            type: "text",
            required: true,
            description: "Connect to a data source node",
            autoFill: true,
          },
          {
            name: "head_rows",
            label: "First N Rows",
            type: "number",
            min: 1,
            max: 50,
            defaultValue: 5,
          },
          {
            name: "tail_rows",
            label: "Last N Rows",
            type: "number",
            min: 1,
            max: 50,
            defaultValue: 5,
          },
        ],
      },
      {
        type: "statistics_view",
        label: "Statistics View",
        description: "Show statistical summary of data",
        category: "view",
        icon: BarChart3,
        color: "#10B981",
        defaultConfig: {
          dataset_id: "",
          include_all: true,
        },
        configFields: [
          {
            name: "dataset_id",
            label: "Dataset Source",
            type: "text",
            required: true,
            description: "Connect to a data source node",
            autoFill: true,
          },
          {
            name: "include_all",
            label: "Include All Columns",
            type: "checkbox",
            defaultValue: true,
            description: "Show stats for all columns",
          },
        ],
      },
      {
        type: "column_info",
        label: "Column Info",
        description: "Display column types and missing values",
        category: "view",
        icon: Info,
        color: "#F59E0B",
        defaultConfig: {
          dataset_id: "",
          show_dtypes: true,
          show_missing: true,
          show_unique: true,
        },
        configFields: [
          {
            name: "dataset_id",
            label: "Dataset Source",
            type: "text",
            required: true,
            description: "Connect to a data source node",
            autoFill: true,
          },
          {
            name: "show_dtypes",
            label: "Show Data Types",
            type: "checkbox",
            defaultValue: true,
          },
          {
            name: "show_missing",
            label: "Show Missing Values",
            type: "checkbox",
            defaultValue: true,
          },
          {
            name: "show_unique",
            label: "Show Unique Counts",
            type: "checkbox",
            defaultValue: true,
          },
        ],
      },
      {
        type: "chart_view",
        label: "Chart View",
        description: "Visualize data with charts",
        category: "view",
        icon: LineChart,
        color: "#EC4899",
        defaultConfig: {
          dataset_id: "",
          chart_type: "bar",
          x_column: "",
          y_column: "",
          y_columns: "",
        },
        configFields: [
          {
            name: "dataset_id",
            label: "Dataset Source",
            type: "text",
            required: true,
            description: "Connect to a data source node",
            autoFill: true,
          },
          {
            name: "chart_type",
            label: "Chart Type",
            type: "select",
            options: [
              { value: "bar", label: "Bar Chart" },
              { value: "line", label: "Line Chart" },
              { value: "scatter", label: "Scatter Plot" },
              { value: "histogram", label: "Histogram" },
              { value: "pie", label: "Pie Chart" },
            ],
            defaultValue: "bar",
          },
          {
            name: "x_column",
            label: "X-Axis Column",
            type: "select",
            required: false,
            autoFill: true,
            description: "Select column for X-axis",
            conditionalDisplay: { field: "chart_type", notEquals: "pie" },
          },
          {
            name: "y_columns",
            label: "Y-Axis Column",
            type: "select",
            required: false,
            autoFill: true,
            description: "Select column for Y-axis",
            conditionalDisplay: { field: "chart_type", notEquals: "pie" },
          },
          {
            name: "label_column",
            label: "Label Column",
            type: "select",
            required: false,
            autoFill: true,
            description: "Column for pie chart labels",
            conditionalDisplay: { field: "chart_type", equals: "pie" },
          },
          {
            name: "value_column",
            label: "Value Column",
            type: "select",
            required: false,
            autoFill: true,
            description: "Column for pie chart values",
            conditionalDisplay: { field: "chart_type", equals: "pie" },
          },
        ],
      },
    ],
  },
  {
    id: "preprocessing",
    label: "Preprocess Data",
    icon: Droplet,
    nodes: [
      {
        type: "missing_value_handler",
        label: "Missing Value Handler",
        description: "Handle missing values with column-wise control",
        category: "preprocessing",
        icon: Droplet,
        color: "#A855F7",
        defaultConfig: {
          dataset_id: "",
          column_configs: {},
          default_strategy: "drop",
          preview_rows: 10,
          preview_mode: false,
        },
        configFields: [
          {
            name: "dataset_id",
            label: "Dataset Source",
            type: "text",
            required: true,
            autoFill: true,
            description: "Connect to a data source node",
          },
          {
            name: "default_strategy",
            label: "Default Strategy",
            type: "select",
            options: [
              { value: "none", label: "No Action" },
              { value: "drop", label: "Drop Rows" },
              { value: "mean", label: "Fill with Mean" },
              { value: "median", label: "Fill with Median" },
              { value: "mode", label: "Fill with Mode" },
              { value: "fill", label: "Fill with Value" },
              { value: "forward_fill", label: "Forward Fill" },
              { value: "backward_fill", label: "Backward Fill" },
            ],
            defaultValue: "none",
            description: "Default strategy for all columns",
          },
          {
            name: "preview_rows",
            label: "Preview Rows",
            type: "number",
            defaultValue: 10,
            min: 5,
            max: 100,
            description: "Number of rows to show in preview",
          },
          {
            name: "preview_mode",
            label: "Preview Mode",
            type: "checkbox",
            defaultValue: false,
            description: "Preview changes before applying",
          },
        ],
      },
    ],
  },
  {
    id: "feature-engineering",
    label: "Feature Engineering",
    icon: Layers,
    nodes: [
      {
        type: "encoding",
        label: "Encoding",
        description: "Encode categorical variables with per-column control",
        category: "feature-engineering",
        icon: Hash,
        color: "#F59E0B",
        defaultConfig: {
          dataset_id: "",
          column_configs: {},
          target_column: "",
        },
        configFields: [
          {
            name: "dataset_id",
            label: "Dataset Source",
            type: "text",
            required: true,
            autoFill: true,
            description: "Connect to a data source node",
          },
          // column_configs handled by custom UI in FeatureEngineeringConfigPanel
        ],
      },
      {
        type: "scaling",
        label: "Scaling / Normalization",
        description: "Scale and normalize features",
        category: "feature-engineering",
        icon: Scale,
        color: "#14B8A6",
        defaultConfig: {
          dataset_id: "",
          method: "standard",
          columns: [],
        },
        configFields: [
          {
            name: "dataset_id",
            label: "Dataset Source",
            type: "text",
            required: true,
            autoFill: true,
            description: "Connect to a data source node",
          },
          {
            name: "method",
            label: "Scaling Method",
            type: "select",
            options: [
              { value: "standard", label: "Standard Scaler (Z-score)" },
              { value: "minmax", label: "Min-Max Scaler" },
              { value: "robust", label: "Robust Scaler" },
              { value: "normalize", label: "Normalizer" },
            ],
            defaultValue: "standard",
          },
        ],
      },
      {
        type: "feature_selection",
        label: "Feature Selection",
        description: "Select most important features",
        category: "feature-engineering",
        icon: Filter,
        color: "#06B6D4",
        defaultConfig: {
          dataset_id: "",
          method: "variance",
          variance_threshold: 0.0,
          correlation_mode: "threshold",
          correlation_threshold: 0.95,
          n_features: 10,
        },
        configFields: [
          {
            name: "dataset_id",
            label: "Dataset Source",
            type: "text",
            required: true,
            autoFill: true,
            description: "Connect to a data source node",
          },
          {
            name: "method",
            label: "Feature Selection Strategy",
            type: "select",
            options: [
              { value: "variance", label: "Variance Threshold (Filtering)" },
              {
                value: "correlation",
                label: "Correlation (Filtering/Ranking)",
              },
            ],
            defaultValue: "variance",
            required: true,
            description: "Choose your feature selection strategy",
          },

          // Variance Threshold fields
          {
            name: "variance_threshold",
            label: "Variance Threshold",
            type: "number",
            min: 0,
            step: 0.01,
            defaultValue: 0.0,
            description:
              "Remove features with variance below this threshold. This is a filtering method.",
            conditionalDisplay: { field: "method", equals: "variance" },
          },

          // Correlation fields
          {
            name: "correlation_mode",
            label: "Correlation Mode",
            type: "select",
            options: [
              {
                value: "threshold",
                label: "Threshold Mode (Remove by correlation)",
              },
              { value: "topk", label: "Top-K Mode (Keep K features)" },
            ],
            required: true,
            description: "Choose how to select features based on correlation",
            conditionalDisplay: { field: "method", equals: "correlation" },
          },
          {
            name: "correlation_threshold",
            label: "Correlation Threshold",
            type: "number",
            min: 0,
            max: 1,
            step: 0.05,
            defaultValue: 0.95,
            description:
              "Remove features with absolute correlation above this value",
            conditionalDisplay: { field: "method", equals: "correlation" },
          },
          {
            name: "n_features",
            label: "Number of Features (K)",
            type: "number",
            min: 1,
            defaultValue: 10,
            description:
              "Number of features to keep after removing highly correlated ones",
            conditionalDisplay: { field: "correlation_mode", equals: "topk" },
          },
        ],
      },
    ],
  },
  {
    id: "target-split",
    label: "Target & Split",
    icon: Split,
    nodes: [
      {
        type: "split",
        label: "Target & Split",
        description: "Select target column and split into train/test sets",
        category: "target-split",
        icon: Split,
        color: "#EC4899",
        defaultConfig: {
          dataset_id: "",
          target_column: "",
          train_ratio: 0.8,
          test_ratio: 0.2,
          split_type: "random",
          random_seed: 42,
          shuffle: true,
        },
        configFields: [
          {
            name: "dataset_id",
            label: "Dataset Source",
            type: "text",
            required: true,
            autoFill: true,
            description: "Connect to a data source node",
          },
          {
            name: "target_column",
            label: "Target Column (y)",
            type: "select",
            required: true,
            autoFill: true,
            description: "Select the target column for prediction",
          },
          {
            name: "train_ratio",
            label: "Train/Test Split",
            type: "range",
            defaultValue: 0.8,
            min: 0.1,
            max: 0.9,
            step: 0.05,
            description: "Training set proportion (test set = 1 - train)",
          },
          {
            name: "split_type",
            label: "Split Type",
            type: "select",
            options: [
              { value: "random", label: "Random Split" },
              {
                value: "stratified",
                label: "Stratified Split (for classification)",
              },
            ],
            defaultValue: "random",
            description: "Stratified split maintains class distribution",
          },
          {
            name: "random_seed",
            label: "Random Seed",
            type: "number",
            defaultValue: 42,
            description: "Seed for reproducible splits",
          },
          {
            name: "shuffle",
            label: "Shuffle Data",
            type: "checkbox",
            defaultValue: true,
            description: "Shuffle data before splitting",
          },
        ],
      },
    ],
  },
  mlAlgorithmsCategory,
  {
    id: "image-pipeline",
    label: "Image Pipeline",
    icon: Camera,
    nodes: [
      {
        type: "image_dataset",
        label: "Image Dataset",
        description: "Load a built-in image dataset or capture one with your camera",
        category: "image-pipeline",
        icon: Camera,
        color: "#8B5CF6",
        defaultConfig: {
          source: "builtin",
          dataset_name: "digits_8x8",
          target_size: "28x28",
          class_names: "",
          images_per_class: 20,
        },
        configFields: [
          {
            name: "dataset_name",
            label: "Dataset",
            type: "select",
            options: [
              { value: "digits_8x8", label: "Digits (8×8, 10 classes)" },
              { value: "mnist_28x28", label: "MNIST (28×28, 10 classes)" },
              { value: "fashion_mnist", label: "Fashion-MNIST (28×28, 10 classes)" },
            ],
            defaultValue: "digits_8x8",
          },
        ],
      },
      {
        type: "image_split",
        label: "Image Split",
        description: "Split images into train/test sets with stratification",
        category: "image-pipeline",
        icon: Scissors,
        color: "#EC4899",
        defaultConfig: {
          dataset_id: "",
          test_size: 0.2,
          stratify: true,
          random_seed: 42,
        },
        configFields: [
          {
            name: "dataset_id",
            label: "Dataset Source",
            type: "text",
            required: true,
            autoFill: true,
            description: "Connect to an Image Dataset node",
          },
          {
            name: "test_size",
            label: "Test Set Ratio",
            type: "range",
            min: 0.1,
            max: 0.5,
            step: 0.05,
            defaultValue: 0.2,
            description: "Fraction of data for testing",
          },
          {
            name: "stratify",
            label: "Stratified Split",
            type: "checkbox",
            defaultValue: true,
            description: "Maintain class proportions in both sets",
          },
          {
            name: "random_seed",
            label: "Random Seed",
            type: "number",
            defaultValue: 42,
          },
        ],
      },
      {
        type: "image_predictions",
        label: "Image Predictions",
        description: "Train with Transfer Learning (MobileNetV2) and evaluate on test images",
        category: "image-pipeline",
        icon: Target,
        color: "#EF4444",
        defaultConfig: {
          train_dataset_id: "",
          test_dataset_id: "",
          epochs: 20,
          learning_rate: 0.0001,
          fine_tune_layers: 0,
          use_augmentation: true,
        },
        configFields: [
          {
            name: "train_dataset_id",
            label: "Train Dataset",
            type: "text",
            required: true,
            autoFill: true,
            description: "Connect to an Image Split node",
          },
          {
            name: "test_dataset_id",
            label: "Test Dataset",
            type: "text",
            required: true,
            autoFill: true,
            description: "Connect to an Image Split node",
          },
          {
            name: "epochs",
            label: "Epochs",
            type: "number",
            min: 1,
            max: 50,
            defaultValue: 20,
            description:
              "Training epochs — fewer needed since MobileNetV2 features are pretrained",
          },
          {
            name: "learning_rate",
            label: "Learning Rate",
            type: "number",
            min: 0.000001,
            max: 0.01,
            step: 0.000001,
            defaultValue: 0.0001,
            description:
              "Lower learning rate for gentle updates to pretrained weights",
          },
          {
            name: "fine_tune_layers",
            label: "Fine-tune Layers",
            type: "number",
            min: 0,
            max: 50,
            step: 1,
            defaultValue: 0,
            description:
              "MobileNetV2 layers to unfreeze (0 = freeze all, recommended for small datasets)",
          },
          {
            name: "use_augmentation",
            label: "Data Augmentation",
            type: "checkbox",
            defaultValue: true,
            description:
              "Apply random rotation, shift, zoom, and brightness during training",
          },
        ],
      },
    ],
  },
  {
    id: "result",
    label: "Results & Metrics",
    icon: TrendingUp,
    nodes: resultNodes,
  },
  genaiCategory,
  activityCategory,
];

export const getAllNodes = (): NodeDefinition[] => {
  return nodeCategories.flatMap((category) => category.nodes);
};

export const getNodeByType = (type: NodeType): NodeDefinition | undefined => {
  return getAllNodes().find((node) => node.type === type);
};

export const getNodesByCategory = (categoryId: string): NodeDefinition[] => {
  const category = nodeCategories.find((cat) => cat.id === categoryId);
  return category?.nodes || [];
};
