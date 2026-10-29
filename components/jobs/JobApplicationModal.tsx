import { Colors } from "@/constants/Colors";
import useGetMe from "@/hooks/auth/use-get-me";
import useApplyForJob from "@/hooks/jobs/use-apply-for-job";
import useGetJob from "@/hooks/jobs/use-get-job";
import { ApplicationSchema, applicationSchema } from "@/schemas/jobs.schema";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import * as DocumentPicker from "expo-document-picker";
import mime from "mime";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Dimensions,
  I18nManager,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface JobApplicationModalProps {
  jobId: string;
}

export type JobApplicationModalRef = {
  open: () => void;
  close: () => void;
};

const { height } = Dimensions.get("window");

const JobApplicationModal = forwardRef<JobApplicationModalRef, JobApplicationModalProps>(
  ({ jobId }, ref) => {
    const { data: job } = useGetJob(jobId);
    const {
      control,
      handleSubmit,
      setValue,
      reset,
      formState: { isSubmitting, errors },
    } = useForm<ApplicationSchema>({
      resolver: zodResolver(applicationSchema),
      defaultValues: {
        cv: new File([], ""),
        answers: job?.questions?.map(() => "") || [],
      },
    });

    const { data: user } = useGetMe();

    useEffect(() => {
      if (user?.cv && user.cv.length > 0) {
        setValue("cv", user.cv as any);
      }
    }, [user?.cv, setValue]);

    // Update answers array when questions change
    React.useEffect(() => {
      if (job?.questions) {
        setValue(
          "answers",
          job.questions.map(() => "")
        );
      }
    }, [job?.questions, setValue]);

    console.log("Form Errors:", errors);

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = React.useMemo(() => ["90%"], []);

    useImperativeHandle(ref, () => ({
      open: () => {
        if (bottomSheetModalRef.current) {
          bottomSheetModalRef.current.present();
          bottomSheetModalRef.current.expand();
        }
      },
      close: () => bottomSheetModalRef.current?.dismiss(),
    }));

    const handleSheetChanges = useCallback(
      (index: number) => {
        if (index === -1) {
          // Reset form when modal is closed
          reset();
        }
      },
      [reset]
    );

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          pressBehavior="close"
        />
      ),
      []
    );

    const handlePickDocument = async () => {
      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ],
        });
        if (!result.canceled) {
          setValue("cv", result.assets[0] as any);
        }
      } catch (err) {
        console.error("Error picking document:", err);
      }
    };

    const { mutate: applyForJob, isPending } = useApplyForJob();

    const onSubmit = async (data: ApplicationSchema) => {
      const formData = new FormData();
      formData.append("cv", {
        uri: data.cv.uri,
        type: mime.getType(data.cv.uri),
        name: data.cv.uri.split("/").pop(),
      } as any);
      data.answers.forEach((answer, index) => {
        formData.append(`answers[${index}]`, answer);
      });
      applyForJob(
        { jobId, data: formData },
        {
          onSuccess: () => {
            bottomSheetModalRef.current?.dismiss();
          },
        }
      );
    };

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={styles.bottomSheetIndicator}
        backgroundStyle={styles.bottomSheetBackground}
        onChange={handleSheetChanges}
        enableDynamicSizing={false}
        enableOverDrag={true}
        enableHandlePanningGesture={true}
        enableContentPanningGesture={true}
      >
        <KeyboardAvoidingView
          style={[styles.container, { height: height * 0.9 }]}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={110}
        >
          <Text style={styles.title}>تقديم طلب</Text>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* CV Upload Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>السيرة الذاتية</Text>
              <Controller
                control={control}
                name="cv"
                render={({ field: { value } }) => (
                  <>
                    <TouchableOpacity style={styles.uploadButton} onPress={handlePickDocument}>
                      <Ionicons name="cloud-upload-outline" size={24} color={Colors.primary} />
                      <Text style={styles.uploadButtonText}>
                        {value && value.uri !== "" ? value.name : "اختر ملف السيرة الذاتية"}
                      </Text>
                    </TouchableOpacity>
                    {errors.cv && <Text style={styles.errorText}>{errors.cv.message}</Text>}
                  </>
                )}
              />
            </View>

            {/* Questions Section */}
            {job?.questions && job?.questions.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>الأسئلة</Text>
                {job?.questions.map((q, index) => (
                  <Controller
                    key={q}
                    control={control}
                    name={`answers.${index}`}
                    render={({ field: { onChange, value } }) => (
                      <View style={styles.questionContainer}>
                        <Text style={styles.questionText}>{q}</Text>
                        <TextInput
                          style={[styles.answerInput, errors.answers?.[index] && styles.errorInput]}
                          multiline
                          numberOfLines={3}
                          textAlignVertical="top"
                          value={value}
                          onChangeText={onChange}
                          placeholder="اكتب إجابتك هنا..."
                        />
                        {errors.answers?.[index] && (
                          <Text style={styles.errorText}>
                            {errors.answers[index]?.message || "الرجاء إدخال إجابة"}
                          </Text>
                        )}
                      </View>
                    )}
                  />
                ))}
              </View>
            )}
          </ScrollView>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, isPending && styles.submitButtonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.submitButtonText}>تقديم الطلب</Text>
            )}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 20,
    fontFamily: "RZ-Bold",
    color: Colors.text.primary,
    marginBottom: 24,
    textAlign: "center",
  },
  content: {
    flex: 1,
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "RZ-Bold",
    color: Colors.text.primary,
    marginBottom: 16,
    textAlign: I18nManager.isRTL ? "left" : "right",
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  uploadButtonText: {
    color: Colors.primary,
    fontFamily: "RZ-Reg",
    fontSize: 14,
  },
  questionContainer: {
    marginBottom: 16,
  },
  questionText: {
    fontSize: 14,
    fontFamily: "RZ-Reg",
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: I18nManager.isRTL ? "left" : "right",
    lineHeight: 24,
  },
  answerInput: {
    borderWidth: 1,
    borderColor: Colors.border.medium,
    borderRadius: 8,
    padding: 12,
    fontFamily: "RZ-Reg",
    fontSize: 14,
    color: Colors.text.primary,
    minHeight: 80,
    textAlign: "right",
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: Colors.white,
    fontFamily: "RZ-Bold",
    fontSize: 16,
  },
  bottomSheetIndicator: {
    backgroundColor: Colors.border.light,
    width: 40,
    height: 4,
  },
  bottomSheetBackground: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  errorInput: {
    borderColor: Colors.danger,
  },
  errorText: {
    color: Colors.danger,
    fontFamily: "RZ-Reg",
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
  },
});

export default JobApplicationModal;
