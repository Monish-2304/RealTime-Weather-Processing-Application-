import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  AlertCircle,
  Search,
  UserCheck,
  RefreshCw,
  BarChart2,
  TrendingUp,
} from "lucide-react";

const HelpPage = () => {
  const features = [
    {
      icon: <Clock className="w-6 h-6 text-blue-500" />,
      title: "Live Metro Cities Weather",
      description:
        "Live weather updates for metro cities are automatically fetched every 5 minutes to ensure you have the most current information.",
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-green-500" />,
      title: "Metro Cities Comparison",
      description:
        "Compare live temperature data across all metro cities to understand regional weather variations.",
    },
    {
      icon: <Search className="w-6 h-6 text-purple-500" />,
      title: "City Weather Search",
      description:
        "Search for weather information of any city worldwide directly from the home page.",
    },
    {
      icon: <UserCheck className="w-6 h-6 text-orange-500" />,
      title: "Temperature Alerts",
      description:
        "Create an account and log in to set custom temperature threshold alerts for specific cities.",
    },
    {
      icon: <AlertCircle className="w-6 h-6 text-red-500" />,
      title: "Smart Alert System",
      description:
        "Once a threshold is set, the system checks temperatures every 5 minutes. Maximum of 3 alerts are sent within 6 hours if temperature exceeds the threshold.",
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-indigo-500" />,
      title: "Current Summary",
      description:
        "Metro cities' weather summary is updated every 5 minutes with live data and the aggregated data is stored in the database. Includes visual chart analysis.",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-yellow-500" />,
      title: "Weekly Analysis",
      description:
        "Analyze weather trends of metro cities over the past week using historical data from our database.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Weather App Features
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              {feature.icon}
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 bg-green-500">
        <CardHeader>
          <CardTitle className="text-2xl">Quick Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-black">
            <li>Login to access all features including temperature alerts</li>
            <li>
              Check the Current Summary tab regularly for up-to-date weather
              analysis
            </li>
            <li>
              Use the Weekly Summary to identify weather patterns and plan ahead
            </li>
            <li>Set meaningful temperature thresholds based on your needs</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPage;
