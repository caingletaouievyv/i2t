# -------------------
# Runtime stage
# -------------------
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Install runtime deps + build deps for Leptonica
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    autoconf automake libtool pkg-config \
    build-essential \
    tesseract-ocr \
    libtesseract-dev \
    hunspell \
    hunspell-en-us \
    && rm -rf /var/lib/apt/lists/*

# Build and install Leptonica 1.82.0
RUN git clone --branch 1.82.0 https://github.com/DanBloomberg/leptonica.git /tmp/leptonica \
    && cd /tmp/leptonica \
    && ./autogen.sh \
    && ./configure \
    && make \
    && make install \
    && cp /usr/local/lib/liblept.so.5 /usr/lib/x86_64-linux-gnu/libleptonica-1.82.0.so \
    && cp /usr/local/lib/liblept.so.5 /app/libleptonica-1.82.0.so \
    && ldconfig \
    && rm -rf /tmp/leptonica

# Copy published app from build stage
COPY --from=build /app/publish ./ 

# Copy tessdata and dictionaries
COPY i2t-Api/tessdata /app/tessdata
COPY i2t-Api/Dictionaries /app/Dictionaries

# Set OCR environment variables
ENV TESSDATA_PREFIX=/app/tessdata
ENV LD_LIBRARY_PATH=/app:/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH

# Entrypoint
ENTRYPOINT ["dotnet", "i2t-Api.dll"]
