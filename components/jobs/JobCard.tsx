import { Colors } from "@/constants/Colors";
import useRecordCategoryClick from "@/hooks/categoryClicks/use-record-category-click";
import useBookmarkJob from "@/hooks/jobs/use-bookmark-job";
import useRecordJobView from "@/hooks/jobs/use-record-job-view";
import useUnbookmarkJob from "@/hooks/jobs/use-unbookmark-job";
import useGetUploads from "@/hooks/use-get-uploads";
import { experienceLevelOptions, workTypeOptions } from "@/types/enums";
import { Job } from "@/types/jobs";
import { formatDate } from "@/utils/date";
import { isRTL } from "@/utils/rtl";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  Share,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import SvgIcon from "../SvgIcon";

const JobCard = ({
  job,
  style,
  renderBoomarkIcon = true,
}: {
  job: Job;
  style?: StyleProp<ViewStyle>;
  renderBoomarkIcon?: boolean;
}) => {
  const { mutate: bookmarkJob, isPending: isBookmarking } = useBookmarkJob();
  const { mutate: unbookmarkJob, isPending: isUnbookmarking } = useUnbookmarkJob();
  const { mutate: recordCategoryClick } = useRecordCategoryClick();
  const { mutate: recordJobView } = useRecordJobView();
  const { data: companyLogo } = useGetUploads(job?.company?.logo || "");

  return (
    <View style={[styles.jobCard, style]}>
      <View style={styles.jobCardHeader}>
        <View style={styles.jobCardActions}>
          {renderBoomarkIcon && (
            <TouchableOpacity
              onPress={() => (job?.isBookmarked ? unbookmarkJob(job.id) : bookmarkJob(job.id))}
              disabled={isBookmarking || isUnbookmarking}
            >
              {job?.isBookmarked ? (
                <SvgIcon name="bookmark-bold" size={24} color={Colors.primary} />
              ) : (
                <SvgIcon name="bookmark-linear" size={24} color={Colors.text.secondary} />
              )}
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => Share.share({ message: `Job: ${job?.jobTitle}` })}>
            <SvgIcon name="share-linear" size={24} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>
        <View style={styles.jobCardHeaderRight}>
          <View style={styles.jobCardHeaderRightLogo}>
            <Image
              source={
                companyLogo ? { uri: companyLogo } : require("@/assets/images/wazfni-logo.png")
              }
              style={{ width: 48, height: 48 }}
              resizeMode="contain"
            />
          </View>
          <View style={styles.jobCardHeaderRightText}>
            <Text style={styles.jobTitle}>{job?.jobTitle}</Text>
            <Text style={styles.jobLocation}>
              {job?.company?.location} {job?.company?.city}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.jobTypeContainer}>
        <ScrollView
          contentContainerStyle={styles.jobTypeContainer}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            direction: isRTL() ? "rtl" : "rtl",
          }}
        >
          <View style={styles.jobTypeTag}>
            <Text style={styles.jobTypeText}>
              {
                experienceLevelOptions.find((option) => option.value === job?.experienceLevel)
                  ?.label
              }
            </Text>
          </View>
          <View style={styles.jobTypeTag}>
            <Text style={styles.jobTypeText}>
              {workTypeOptions.find((option) => option.value === job?.workType)?.label}
            </Text>
          </View>
          {job?.subCategories &&
            job?.subCategories?.length > 0 &&
            job?.subCategories?.map((category) => (
              <View key={category.id} style={styles.jobTypeTag}>
                <Text style={styles.jobTypeText}>{category.name}</Text>
              </View>
            ))}
        </ScrollView>
      </View>

      <View style={styles.jobCardFooter}>
        <Text style={styles.jobDate}>{formatDate(job?.createdAt, "DD   MMMM   YYYY")}</Text>
        <TouchableOpacity
          onPress={() => {
            recordCategoryClick({ categoryId: job?.subCategories?.[0]?.id });
            recordJobView({ jobId: job?.id });
            router.push({
              pathname: "/(app)/(job)/details/[id]",
              params: {
                id: job?.id,
              },
            });
          }}
        >
          <Text style={styles.viewJobButton}>عرض الفرصة</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default JobCard;

const styles = StyleSheet.create({
  jobCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    width: 300,
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  jobCardHeader: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    justifyContent: "space-between",
  },
  jobCardHeaderRight: {
    flexDirection: isRTL() ? "row" : "row-reverse",
    alignItems: "flex-start",
    gap: 8,
  },
  jobCardHeaderRightLogo: {
    width: 48,
    height: 48,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.border.light,
    overflow: "hidden",
    resizeMode: "contain",
  },
  jobCardHeaderRightText: {
    flexDirection: "column",
    gap: 4,
    alignItems: isRTL() ? "flex-start" : "flex-end",
  },
  jobCardActions: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    gap: 8,
  },
  jobTitle: {
    fontSize: 14,
    color: Colors.text.primary,
    fontFamily: "RZ-Bold",
  },
  jobLocation: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
  },
  jobTypeContainer: {
    flexDirection: isRTL() ? "row" : "row-reverse",
    gap: 8,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  jobTypeTag: {
    backgroundColor: Colors.border.light,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 50,
    marginHorizontal: 4,
  },
  jobTypeText: {
    fontSize: 12,
    color: Colors.primary,
    fontFamily: "RZ-Reg",
    textAlign: "center",
  },
  jobCardFooter: {
    flexDirection: isRTL() ? "row" : "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    paddingTop: 16,
  },
  viewJobButton: {
    fontSize: 10,
    color: Colors.primary,
    fontFamily: "RZ-Reg",
    lineHeight: 24,
  },
  jobDate: {
    fontSize: 10,
    color: Colors.text.secondary,
    fontFamily: "RZ-Reg",
  },
});
