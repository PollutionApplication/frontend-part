if(NOT TARGET fbjni::fbjni)
add_library(fbjni::fbjni SHARED IMPORTED)
set_target_properties(fbjni::fbjni PROPERTIES
    IMPORTED_LOCATION "/Users/siddhardhakireeti/.gradle/caches/8.14.1/transforms/ed4deab58c065412a1ae9f5fa83c00f4/transformed/fbjni-0.7.0/prefab/modules/fbjni/libs/android.arm64-v8a/libfbjni.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/siddhardhakireeti/.gradle/caches/8.14.1/transforms/ed4deab58c065412a1ae9f5fa83c00f4/transformed/fbjni-0.7.0/prefab/modules/fbjni/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

