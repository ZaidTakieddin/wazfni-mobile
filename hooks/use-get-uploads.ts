import { Urls } from "@/constants/Urls";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const useGetUploads = (id: string): UseQueryResult<string | null, Error> => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const blobQuery = useQuery({
    queryKey: ["uploads", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`${Urls.UPLOAD_URL}${id}`, {
        responseType: "blob",
      });
      return response.data;
    },
    enabled: !!id,
  });

  // Convert blob to data URI when blob data changes
  useEffect(() => {
    if (blobQuery.data) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUri(reader.result as string);
      };
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
      };
      reader.readAsDataURL(blobQuery.data);
    } else {
      setImageUri(null);
    }
  }, [blobQuery.data]);

  return {
    ...blobQuery,
    data: imageUri,
  } as UseQueryResult<string | null, Error>;
};

export default useGetUploads;
