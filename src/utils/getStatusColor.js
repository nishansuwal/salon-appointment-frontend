export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
    case "active":
    case "paid":
    case "approved":
      return "bg-green-100 text-green-700";
    
    case "cancelled":
    case "inactive":
    case "rejected":
    case "failed":
      return "bg-red-100 text-red-700";
    
    case "pending":
    case "awaiting":
    case "processing":
      return "bg-yellow-100 text-yellow-700";
    
    case "in-progress":
    case "ongoing":
      return "bg-blue-100 text-blue-700";
    
    default:
      return "bg-gray-100 text-gray-700";
  }
};