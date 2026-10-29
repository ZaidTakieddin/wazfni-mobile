import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { cloneElement, ReactNode, RefObject, useCallback } from 'react';

interface CustomBottomModalSheetProps {
  bottomSheetModalRef: RefObject<BottomSheetModal>;
  snapPoints: string[];
  handleSheetChanges: (index: number) => void;
  children: ReactNode;
  handleDismissModalPress: () => void;
  backdropBehave?: 'none' | 'light' | 'dark';
  enablePanDownToClose?: boolean;
}

const CustomBottomModalSheet = ({
  bottomSheetModalRef,
  snapPoints = ['50%'],
  handleSheetChanges,
  children,
  handleDismissModalPress,
  backdropBehave = 'none',
  enablePanDownToClose = false,
}: CustomBottomModalSheetProps) => {
  // renders
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        pressBehavior={backdropBehave}
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={1}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      enablePanDownToClose={enablePanDownToClose}
      backgroundStyle={{ backgroundColor: '#FFF' }}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      index={0}
      stackBehavior="replace"
      backdropComponent={renderBackdrop}
      ref={bottomSheetModalRef}
      onChange={handleSheetChanges}>
      <BottomSheetView>
        {children &&
          cloneElement(children as React.ReactElement, {
            onClose: handleDismissModalPress,
          })}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default CustomBottomModalSheet;
